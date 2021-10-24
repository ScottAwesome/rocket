/* eslint-disable @typescript-eslint/ban-ts-comment */

/** @typedef {import('../types/main').EngineOptions} EngineOptions */
import fs from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

import { applyPlugins } from 'plugins-manager';

import { gatherFiles } from './gatherFiles.js';
import { cleanupWorker, renderViaWorker } from './renderViaWorker.js';
import { debounce } from './helpers/debounce.js';
import { updateRocketHeader } from './updateRocketHeader.js';
import { Watcher } from './Watcher.js';

export class Engine {
  /** @type {EngineOptions} */
  options = {
    plugins: undefined,
    defaultPlugins: [],
    setupPlugins: [],
  };

  events = new EventEmitter();

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

  async start() {
    await this.watchForRocketHeaderUpdate();
  }

  async watchForRocketHeaderUpdate() {
    const files = await gatherFiles(this.docsDir);

    this.watcher = new Watcher();
    await this.watcher.addPages(files);

    const debouncedUpdateEvent = debounce(() => {
      this.events.emit('rocketHeaderUpdated');
    }, 5, false);

    this.watcher.watchPages(async page => {
      await updateRocketHeader(page.filePath, this.docsDir);
      debouncedUpdateEvent();
    });
  }

  // async watch() {
  //   // TODO: do not gather files two times
  //   const files = await gatherFiles(this.docsDir);

  //   this._watchController = new AbortController();

  //   for (const filePath of files) {
  //     fs.watch(
  //       filePath,
  //       { signal: this._watchController.signal },
  //       debounce(() => this.renderFile(filePath), 25, true),
  //     );
  //   }
  // }

  async cleanup() {
    if (this.watcher) {
      this.watcher.cleanup();
    }
    await cleanupWorker();
  }

  async renderFile(filePath) {
    await updateRocketHeader(filePath, this.docsDir);
    await renderViaWorker({ filePath, outputDir: this.outputDir });
  }
}
