import { readdir } from 'fs/promises';
import path from 'path';
import { slugify } from './slugify.js';

/**
 * @param {string} inRootDir
 * @param {object} [options]
 * @param {string} [options.mode]
 * @param {number} [options.level]
 * @param {string} [options.url]
 * @returns
 */
export async function gatherFiles(inRootDir, options = {}) {
  const rootDir = path.resolve(inRootDir);
  let files = [];

  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const { name } = entry;
    const currentPath = path.join(rootDir, name);

    if (entry.isDirectory()) {
      // if (slugify(name) !== name.replace(/\./g, '')) {
      //   throw new Error(
      //     `Folder at "${currentPath}"" is using invalid characters. Use only url safe characters like [a-z][A-Z]-_. Name Suggestion: ${slugify(name)}`,
      //   );
      // }
      files = [...files, ...(await gatherFiles(currentPath, options))];
    } else if (name.endsWith('.rocket.js') || name.endsWith('.rocket.md') || name.endsWith('.rocket.html')) {
      // if (slugify(name) !== name.replace(/\./g, '')) {
      //   throw new Error(
      //     `File at "${currentPath}" is using invalid characters. Use only url safe characters like [a-z][A-Z]-_`,
      //   );
      // }
      const filePath = path.join(rootDir, name);
      files.push(filePath);
    }
  }
  return files;
}
