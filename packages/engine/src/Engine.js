/* eslint-disable @typescript-eslint/ban-ts-comment */

/** @typedef {import('../types/main').EngineOptions} EngineOptions */
import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

import { applyPlugins } from 'plugins-manager';

import { gatherFiles } from './gatherFiles.js';
import { cleanupWorker, renderViaWorker } from './renderViaWorker.js';
import { debounce } from './helpers/debounce.js';
import { updateRocketHeader } from './updateRocketHeader.js';

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

  async renderFile(filePath) {
    await updateRocketHeader(filePath, this.docsDir);
    await renderViaWorker({ filePath, docsDir: this.docsDir, outputDir: this.outputDir });
  }
}
