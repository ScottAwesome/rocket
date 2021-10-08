import path from 'path';
import chai from 'chai';
import { fileURLToPath } from 'url';
import prettier from 'prettier';
import { writeFile } from 'fs/promises';

import { Engine } from '../src/Engine.js';
import { existsSync, readFileSync } from 'fs';

const { expect } = chai;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {function} method
 * @param {string} errorMessage
 */
export async function expectThrowsAsync(method, { errorMatch, errorMessage } = {}) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMatch) {
    expect(error.message).to.match(errorMatch);
  }
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
}

export function setupTestEngine(docsDir) {
  const options = { docsDir };
  if (options.docsDir) {
    options.docsDir = path.join(__dirname, docsDir.split('/').join(path.sep));
  }
  options.outputDir = path.join(options.docsDir, '..', '__output');

  const engine = new Engine();
  engine.setOptions(options);

  function readOutput(toInspect, { format = false } = {}) {
    const filePath = path.join(engine.outputDir, toInspect);
    let text = readFileSync(filePath).toString();
    if (format) {
      text = prettier.format(text, { parser: format, printWidth: 100 });
    }
    return text;
  }

  function readSource(toInspect, { format = false } = {}) {
    const filePath = path.join(engine.docsDir, toInspect);
    let text = readFileSync(filePath).toString();
    if (format) {
      text = prettier.format(text, { parser: format, printWidth: 100 });
    }
    return text;
  }

  async function writeSource(toInspect, text) {
    const filePath = path.join(engine.docsDir, toInspect);
    await writeFile(filePath, text);
  }

  function outputExists(toInspect) {
    const filePath = path.join(engine.outputDir, toInspect);
    return existsSync(filePath);
  }

  async function cleanup() {
    await engine.cleanup();
  }

  async function execute() {
    await engine.run();
    await cleanup();
  }

  function watch() {
    engine.watch();
  }

  return { readOutput, outputExists, readSource, execute, writeSource, watch, cleanup };
}
