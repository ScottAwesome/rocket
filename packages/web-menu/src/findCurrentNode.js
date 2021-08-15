export function findCurrentNode(node) {
  return node.first(entry => entry.model.current === true);
}
