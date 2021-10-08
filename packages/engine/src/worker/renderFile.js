import path from 'path';
import { mdjsProcess } from '@mdjs/core';
import { parentPort } from 'worker_threads';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { mdToJsWithMd } from '../mdToJsWithMd.js';
import { pathToUrl } from '../urlPathConverter.js';

function resolvePermalink(data) {
  if (!data.permalink) {
    throw new Error(`No permalink found for ${data.relativeFilePath}`);
  }
  const { permalink } = data;
  if (typeof permalink === 'function') {
    return permalink(data);
  }
  if (typeof permalink === 'string') {
    return permalink;
  }
}

async function renderFile({ filePath, docsDir, outputDir }) {
  let toImportFilePath = filePath;
  if (filePath.endsWith('.md')) {
    const mdContent = await readFile(filePath);
    const jsWithMd = mdToJsWithMd(mdContent.toString());
    toImportFilePath = filePath.replace(/\.md$/, '.rocket-generated-from-md.js');
    await writeFile(toImportFilePath, jsWithMd);
  }

  const { default: content, relativeFilePath, layout, ...data } = await import(toImportFilePath);

  // data.relativeFilePath = path.relative(docsDir, toImportFilePath);
  const relWriteFilePath = pathToUrl(relativeFilePath, docsDir);
  const outputWriteFilePath = path.join(outputDir, relWriteFilePath);

  let contentForLayout = content;
  if (toImportFilePath.endsWith('.rocket-generated-from-md.js')) {
    const mdjs = await mdjsProcess(content);
    contentForLayout = mdjs.html;
  }

  const fileContent = layout ? layout(contentForLayout, data) : contentForLayout;

  if (!existsSync(path.dirname(outputWriteFilePath))) {
    await mkdir(path.dirname(outputWriteFilePath), { recursive: true });
  }
  await writeFile(outputWriteFilePath, fileContent);

  parentPort.postMessage({
    status: 200,
    outputWriteFilePath,
  });
}

parentPort.on('message', message => {
  if (message.action === 'renderFile') {
    const { filePath, docsDir, outputDir } = message;
    renderFile({ filePath, docsDir, outputDir });
  }
});
