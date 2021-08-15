/** @typedef {import('../types/main').renderFn} renderFn */

/**
 * @param {renderFn} options
 * @returns
 */
function defaultList(options) {
  const { node, listItem, childCondition, listTag } = options;

  if (childCondition(node) && node.children) {
    const lvl = node.model.level;
    return `
      <${listTag} class="lvl-${lvl + 1}">
        ${node.children.map(child => listItem({ ...options, node: child })).join('')}
      </${listTag}>
    `;
  }
  return '';
}

/**
 * @param {renderFn} options
 * @returns {string}
 */
function defaultListItem(options) {
  const { node, link, list } = options;

  let cssClasses = '';
  if (node.model.active) {
    cssClasses = ' class="web-menu-active" ';
  }
  if (node.model.current) {
    cssClasses = ' class="web-menu-current" ';
  }
  return `<li${cssClasses}>${link(options)}${
    node.children && node.children.length > 0 ? list(options) : ''
  }</li>`;
}

/**
 * @param {renderFn} options
 * @returns {string}
 */
function defaultLink({ node, currentNode }) {
  const current = node === currentNode ? ' aria-current="page" ' : '';
  return `<a href="${node.model.url}"${current}>${node.model.name}</a>`;
}

/**
 * @param {renderFn} options
 * @returns {Promise<string>}
 */
async function defaultRender({ list, ...options }) {
  return `
    <nav aria-label="Main">
      ${list({ list, ...options })}
    </nav>
  `;
}

/**
 * @param {renderFn} options
 * @returns {Promise<string>}
 */
export async function renderMenu(options) {
  const {
    node,
    render = defaultRender,
    list = defaultList,
    listItem = defaultListItem,
    link = defaultLink,
    childCondition = () => true,
    listTag = 'ul',
  } = options;
  const currentNode = node.first(entry => entry.model.current === true);
  return render({ ...options, node, currentNode, list, listItem, link, childCondition, listTag });
}
