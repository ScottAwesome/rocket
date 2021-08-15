import { Menu } from '../Menu.js';

export class Header extends Menu {
  static type = 'header';

  /**
   * @returns {string}
   */
  render(node) {
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
