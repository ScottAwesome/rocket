import { Menu } from '../Menu.js';

/** @typedef {import('../../types/main').NodeOfPage} NodeOfPage */

export class Header extends Menu {
  static type = 'header';

  /**
   * @param {NodeOfPage} node
   * @returns {Promise<string>}
   */
  async render(node) {
    if (!node.children) {
      return '';
    }
    return `
      <nav aria-label="Header">
        ${node.children.map(child => this.link(child)).join('\n')}
      </nav>
    `;
  }
}
