/* eslint-disable @typescript-eslint/ban-ts-comment */

/** @typedef {import('../types/main').EngineOptions} EngineOptions */
import fs from 'fs';
import { writeFile, mkdir, readFile } from 'fs/promises';
import path from 'path';
import { init, parse } from 'es-module-lexer';

import { applyPlugins } from 'plugins-manager';

import { gatherFiles } from './gatherFiles.js';
import { cleanupWorker, renderViaWorker } from './renderViaWorker.js';
import { debounce } from './helpers/debounce.js';

await init;

function setRocketHeader(content, header, filePath) {
  const lines = content.toString().split('\n');

  let startIndex = -1;
  let endIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '/* START - Rocket auto generated - do not touch */') {
      startIndex = i;
    }
    if (lines[i].trim() === '/* END - Rocket auto generated - do not touch */') {
      endIndex = i;
    }
  }

  if (startIndex && !endIndex) {
    throw new Error(`No "/* END - Rocket auto generated - do not touch */" found in ${filePath}`);
  }

  if (startIndex >= 0 && endIndex >= 0) {
    lines.splice(startIndex, endIndex - startIndex + 1, header);
  } else {
    const wrapBefore = filePath.endsWith('.md') ? ['```js server'] : [];
    const warpAfter = filePath.endsWith('.md') ? ['```'] : [];

    lines.unshift([...wrapBefore, header, ...warpAfter, ''].join('\n'));
  }

  return lines.join('\n');
}

async function generateRocketHeader(content, { filePath, docsDir }) {
  const dataFiles = [
    {
      filePath: new URL('../preset/data.rocketData.js', import.meta.url),
      exportModuleName: '@rocket/engine',
    },
  ];

  // Add `thisDir.rocketData.js` if available
  const thisDirFilePath = path.join(path.dirname(filePath), 'thisDir.rocketData.js');
  if (fs.existsSync(thisDirFilePath)) {
    dataFiles.push({
      filePath: thisDirFilePath,
      exportModuleName: './thisDir.rocketData.js',
    });
  }

  const possibleImports = [];
  for (const dataFile of dataFiles) {
    const { filePath: dataFilePath, exportModuleName } = dataFile;
    const readDataFile = await readFile(dataFilePath);
    const [imports, exports] = parse(readDataFile.toString());

    for (const dataExportName of exports) {
      const foundIndex = possibleImports.findIndex(el => el.importName === dataExportName);
      if (foundIndex >= 0) {
        possibleImports[foundIndex].importModuleName = exportModuleName;
      } else {
        possibleImports.push({
          importName: dataExportName,
          importModuleName: exportModuleName,
        });
      }
    }
  }

  const contentWithoutRocketHeader = setRocketHeader(content, '', filePath);
  const [imports, thisExports] = parse(contentWithoutRocketHeader);

  for (const thisExport of thisExports) {
    const foundIndex = possibleImports.findIndex(el => el.importName === thisExport);
    if (foundIndex >= 0) {
      possibleImports.splice(foundIndex, 1);
    }
  }

  const exportsString =
    possibleImports.length > 0
      ? [`export { ${possibleImports.map(el => el.importName).join(', ')} };`]
      : [];

  const relFilePath = path.relative(docsDir, filePath);
  const header = [
    '/* START - Rocket auto generated - do not touch */',
    `export const relativeFilePath = '${relFilePath}';`,
    ...possibleImports.map(el => `import { ${el.importName} } from '${el.importModuleName}';`),
    ...exportsString,
    '/* END - Rocket auto generated - do not touch */',
  ].join('\n');

  return header;
}

export class Engine {
  /** @type {EngineOptions} */
  options = {
    plugins: undefined,
    defaultPlugins: [],
    setupPlugins: [],
  };

  /**
   * @param {Partial<EngineOptions>} options
   */
  constructor(options) {
    this.setOptions(options);
  }

  /**
   * @param {Partial<EngineOptions>} newOptions
   */
  setOptions(newOptions) {
    if (!newOptions) {
      return;
    }
    const setupPlugins = newOptions.setupPlugins
      ? [...this.options.setupPlugins, ...newOptions.setupPlugins]
      : this.options.setupPlugins;

    this.options = {
      ...this.options,
      ...newOptions,
      setupPlugins,
    };
    const defaultPlugins = [...this.options.defaultPlugins];
    delete this.options.defaultPlugins;

    this.options = applyPlugins(this.options, defaultPlugins);

    const { docsDir: userDocsDir, outputDir: userOutputDir } = this.options;
    this.docsDir = userDocsDir ? path.resolve(userDocsDir) : process.cwd();
    this.outputDir = userOutputDir
      ? path.resolve(userOutputDir)
      : path.join(this.docsDir, '..', '_site');
  }

  async run() {
    if (!fs.existsSync(this.outputDir)) {
      await mkdir(this.outputDir, { recursive: true });
    }

    // write files
    const files = await gatherFiles(this.docsDir);

    for (const filePath of files) {
      await this.renderFile(filePath);
    }
  }

  async watch() {
    // TODO: do not gather files two times
    const files = await gatherFiles(this.docsDir);

    for (const filePath of files) {
      // TODO: use abort signal
      this.foo = fs.watch(
        filePath,
        debounce(() => this.renderFile(filePath), 25, true),
      );
    }
  }

  async cleanup() {
    this.foo?.close();
    await cleanupWorker();
  }

  async injectRocketHeader(filePath) {
    const content = await readFile(filePath);
    const header = await generateRocketHeader(content, { filePath, docsDir: this.docsDir });
    const updatedContent = setRocketHeader(content, header, filePath);

    await writeFile(filePath, updatedContent);
  }

  async renderFile(filePath) {
    await this.injectRocketHeader(filePath);
    await renderViaWorker({ filePath, docsDir: this.docsDir, outputDir: this.outputDir });
  }
}
