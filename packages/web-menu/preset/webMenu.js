import path from 'path';
import { fileURLToPath } from 'url';
import { addPlugin } from 'plugins-manager';
import { RocketCliPlugin } from './RocketCliPlugin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function webMenu() {
  return {
    path: path.resolve(__dirname),
    setupCliPlugins: [addPlugin(RocketCliPlugin)],
  };
}
