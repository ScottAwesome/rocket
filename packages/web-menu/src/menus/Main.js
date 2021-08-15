import { Menu } from '../Menu.js';

export class Main extends Menu {
  static type = 'main';

  /**
   * @param {renderFn} options
   * @returns {Promise<string>}
   */
  async render(node) {
    if (!this.currentNode) {
      return '';
    }
    const activeLevelTwo = this.currentNode.getPath()[1] || node;
    return `
      <nav aria-label="main">
        ${this.list(activeLevelTwo)}
      </nav>
    `;
  }

  /**
   * @param {renderFn} options
   * @returns {string}
   */
  link(node) {
    if (node.children && node.children.length > 0) {
      const lvl = node.model.level;
      return lvl < 3 ? `<span>${node.model.name}</span>` : '';
    }
    const current = node === this.currentNode ? ' aria-current="page" ' : '';
    return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
  }

  /**
   * @param {renderFn} options
   * @returns {string}
   */
  list(node) {
    if (!this.currentNode) {
      return '';
    }
    const open = this.currentNode.getPath().includes(node) ? 'open' : '';

    if (this.childCondition(node) && node.children) {
      const lvl = node.model.level;
      const { listTag } = this.options;
      return `
        ${lvl > 2 ? `<details ${open}><summary>${node.model.name}</summary>` : ''}
          <${listTag} class="lvl-${lvl + 1}">
            ${node.children.map(child => this.listItem(child)).join('')}
          </${listTag}>
        ${lvl > 2 ? `</details>` : ''}
      `;
    }
    return '';
  }
}
