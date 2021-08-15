/** @typedef {import('../types/main').renderFn} renderFn */
/** @typedef {import('../types/main').Page} Page */
/** @typedef {import('tree-model/types').Node<Page>} NodeOfPage */

export const defaultPresets = {
  header: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, link, ...options }) => {
      if (!node.children) {
        return '';
      }
      return `
        <nav aria-label="Header">
          ${node.children.map(child => link({ node: child, link, ...options })).join('\n')}
        </nav>
      `;
    },
  },
  headerWithoutNav: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, link, ...options }) => {
      if (!node.children) {
        return '';
      }
      return node.children.map(child => link({ node: child, link, ...options })).join('\n');
    },
  },
  breadcrumb: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ node, listItem, ...options }) => {
      const current = node.first(node => node.model.current === true);
      if (!current) {
        return '';
      }
      const nodePath = current.getPath();
      /** @param {NodeOfPage} node */
      const breadcrumbItem = node =>
        listItem({ node, listItem, ...options, childCondition: () => false });
      return `
        <nav aria-label="Breadcrumb">
          <ol>
            ${nodePath.map(node => breadcrumbItem(node)).join('\n')}
          </ol>
        </nav>
      `;
    },
  },
  main: {
    label: 'Main',
    /**
     * @param {renderFn} options
     * @returns {Promise<string>}
     */
    render: async ({ list, node, currentNode, ...options }) => {
      if (!currentNode) {
        return '';
      }
      const activeLevelTwo = currentNode.getPath()[1] || node;
      return `
        <nav aria-label="main">
          ${list({ node: activeLevelTwo, list, currentNode, ...options })}
        </nav>
      `;
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    link: ({ node, currentNode }) => {
      if (node.children && node.children.length > 0) {
        const lvl = node.model.level;
        return lvl < 3 ? `<span>${node.model.name}</span>` : '';
      }
      const current = node === currentNode ? ' aria-current="page" ' : '';
      return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    list: options => {
      const { node, listItem, childCondition, listTag, currentNode } = options;
      if (!currentNode) {
        return '';
      }
      const open = currentNode.getPath().includes(node) ? 'open' : '';

      if (childCondition(node) && node.children) {
        const lvl = node.model.level;
        return `
          ${lvl > 2 ? `<details ${open}><summary>${node.model.name}</summary>` : ''}
            <${listTag} class="lvl-${lvl + 1}">
              ${node.children.map(child => listItem({ ...options, node: child })).join('')}
            </${listTag}>
          ${lvl > 2 ? `</details>` : ''}
        `;
      }
      return '';
    },
  },
  tableOfContents: {
    navLabel: 'Table of Contents',
    navHeader: '<h2>Contents</h2>',
    /** @param {string} nav */
    navWrapper: nav => `<aside>${nav}</aside>`,
    /**
     * @param {renderFn} options
     * @returns {Promise<string>}
     */
    render: async ({ list, currentNode, navHeader, navLabel, navWrapper, ...options }) => {
      if (!currentNode) {
        return '';
      }
      if (
        currentNode.model.tableOfContentsNode &&
        currentNode.model.tableOfContentsNode.children.length > 0
      ) {
        const navString = `
          ${navHeader}
          <nav aria-label="${navLabel}">
            ${list({
              ...options,
              node: currentNode.model.tableOfContentsNode,
              list,
              currentNode,
              listTag: 'ol',
            })}
          </nav>
        `;
        return navWrapper(navString);
      }
      return '';
    },
  },
  articleOverview: {
    /** @param {NodeOfPage} node */
    renderDescription: node => {
      if (node.model.subHeading) {
        return `
          <div class="description">
            <a href="${node.model.url}" tabindex="-1">
              <p>${node.model.subHeading}</p>
            </a>
          </div>
        `;
      }
      return '';
    },
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ currentNode, renderDescription }) => {
      if (!currentNode || !currentNode.children) {
        return '';
      }
      return `
        <div>
          ${currentNode.children
            .map(
              child => `
                <article class="post">
                  <a href="${child.model.url}">
                    <h2>${child.model.name}</h2>
                  </a>
                  ${renderDescription(child)}
                </article>
              `,
            )
            .join('')}
        </div>
      `;
    },
  },
  next: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ currentNode }) => {
      if (!currentNode) {
        return '';
      }
      const parents = currentNode.getPath();
      let next;
      if (parents.length > 1) {
        const parent = parents[parents.length - 2];
        if (parent && parent.children) {
          next = parent.children[currentNode.getIndex() + 1];
        }
      }
      if (!next) {
        if (currentNode.children) {
          next = currentNode.children[0];
        }
      }
      if (next) {
        return `
          <a href="${next.model.url}">
            <span>next</span>
            <span>${next.model.name}</span>
          </a>
        `;
      }
      return '';
    },
  },
  previous: {
    /**
     * @param {renderFn} options
     * @returns {string}
     */
    render: ({ currentNode }) => {
      if (!currentNode) {
        return '';
      }
      const parents = currentNode.getPath();
      let previous;
      if (parents.length > 1) {
        const parent = parents[parents.length - 2];
        if (parent && parent.children) {
          previous = parent.children[currentNode.getIndex() - 1];
          if (!previous) {
            previous = parent;
          }
        }
      }
      if (previous) {
        return `
          <a href="${previous.model.url}">
            <span>previous</span>
            <span>${previous.model.name}</span>
          </a>
        `;
      }
      return '';
    },
  },
};
