/** @typedef {import('../types/main').renderFn} renderFn */

export class Menu {
  static type = 'menu';

  currentNode = null;

  options = {
    listTag: 'ul',
  }

  constructor(options = {}) {
    this.options = { ...this.options, ...options };
  }

  childCondition() {
    return true;
  }

  list(node) {
    if (this.childCondition(node) && node.children) {
      const lvl = node.model.level;
      const { listTag } = this.options;
      return `
        <${listTag} class="lvl-${lvl + 1}">
          ${node.children.map(child => this.listItem(child)).join('')}
        </${listTag}>
      `;
    }
    return '';
  }

  listItem(node) {
    let cssClasses = '';
    if (node.model.active) {
      cssClasses = ' class="web-menu-active" ';
    }
    if (node.model.current) {
      cssClasses = ' class="web-menu-current" ';
    }
    return `<li${cssClasses}>${this.link(node)}${
      node.children && node.children.length > 0 ? this.list(node) : ''
    }</li>`;
  }

  link(node) {
    const current = node === this.currentNode ? ' aria-current="page" ' : '';
    return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
  }

  async render(node) {
    return `
      <nav aria-label="Main">
        ${this.list(node)}
      </nav>
    `;
  }
}
