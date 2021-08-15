import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';
import { readFile } from 'fs/promises';

import { buildTree } from '@web/menu';
import { parseHtmlFile } from '../src/parseHtmlFile.js';
import { WebMenuCli } from '../src/WebMenuCli.js';
export { modelComparatorFn } from '../src/buildTree.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function executeBuildTree(inPath, opts) {
  const testDir = path.join(__dirname, inPath.split('/').join(path.sep));
  const tree = await buildTree(testDir, opts);
  return tree;
}

export function cleanup(tree, filter = key => ['fileString', 'menus'].includes(key)) {
  for (const key of Object.keys(tree)) {
    if (key === 'model') {
      for (const modelKey of Object.keys(tree.model)) {
        if (filter(modelKey)) {
          delete tree.model[modelKey];
        }
      }
    }
    if (key === 'children') {
      tree.children = tree.children.map(child => cleanup(child));
    }
    if (filter(key)) {
      delete tree[key];
    }
  }
  return tree;
}

export async function executeParse(inPath, opts = {}) {
  const testFile = path.join(__dirname, inPath.split('/').join(path.sep));
  opts.rootDir = opts.rootDir
    ? path.join(__dirname, opts.rootDir.split('/').join(path.sep))
    : path.dirname(testFile);
  const metaData = await parseHtmlFile(testFile, opts);
  return metaData;
}

export async function executeCli({ docsDir, configFile } = {}, { captureLog = false } = {}) {
  const options = { docsDir, configFile };
  if (docsDir) {
    options.docsDir = path.join(__dirname, docsDir.split('/').join(path.sep));
  }
  if (configFile) {
    options.configFile = path.join(__dirname, configFile.split('/').join(path.sep));
  }

  let log = [];
  const origLog = console.log;
  if (captureLog) {
    console.log = (...args) => {
      log = [...log, ...args];
    };
  }

  const cli = new WebMenuCli();
  cli.setOptions(options);
  await cli.run();

  async function readOutput(toInspect) {
    const filePath = path.join(cli.outputDir, toInspect);
    let text = await readFile(filePath);
    text = text.toString();
    text = format(text);
    return text;
  }

  if (captureLog) {
    console.log = origLog;
  }
  return { log, readOutput };
}

export function format(str) {
  return prettier.format(str, { parser: 'html', printWidth: 100 });
}
