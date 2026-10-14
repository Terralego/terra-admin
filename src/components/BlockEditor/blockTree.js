/**
 * Pure helpers on a tree of blocks, shared by every block editor.
 *
 * A block is `{ id, type, ...settings }`. A container block holds its children
 * in one or more branches, named by its type definition in the registry
 * (`children`, or `then` and `else` for a condition). A place in the tree is
 * `{ parentId, branch, index }`, with `parentId: null` for the top level.
 *
 * A registry maps each type to its definition:
 *   - branches: keys of the arrays holding its children (none by default)
 *   - accepts(childType): whether a direct child of that type is allowed
 *   - excludesInside: types allowed nowhere below it, even indirectly
 */

export const ROOT = { parentId: null, branch: null };

export const getBranches = (registry, block) => registry[block?.type]?.branches ?? [];

const childrenOf = (registry, block) =>
  getBranches(registry, block).flatMap(branch => block[branch] ?? []);

/**
 * Where a block is: its parent, branch, index, depth (1 at the top level)
 * and the types of its ancestors, closest last. Null if it is not there.
 */
export const findBlock = (registry, blocks, id, parent = { ...ROOT, depth: 0, ancestors: [] }) => {
  for (const [index, block] of blocks.entries()) {
    if (block.id === id) {
      return {
        block,
        parentId: parent.parentId,
        branch: parent.branch,
        index,
        depth: parent.depth + 1,
        ancestors: parent.ancestors,
      };
    }
    for (const branch of getBranches(registry, block)) {
      const found = findBlock(registry, block[branch] ?? [], id, {
        parentId: block.id,
        branch,
        depth: parent.depth + 1,
        ancestors: [...parent.ancestors, block.type],
      });
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/** Number of levels of a block and its descendants (1 for a leaf). */
export const getHeight = (registry, block) =>
  1 + Math.max(0, ...childrenOf(registry, block).map(child => getHeight(registry, child)));

const getTypes = (registry, block) =>
  [block.type, ...childrenOf(registry, block).flatMap(child => getTypes(registry, child))];

const isInside = (registry, block, id) =>
  childrenOf(registry, block).some(child => child.id === id || isInside(registry, child, id));

/** Applies `change` to the array of the container at `parentId`/`branch`. */
const changeContainer = (registry, blocks, { parentId, branch }, change) => {
  if (parentId === null) {
    return change(blocks);
  }
  return blocks.map(block => {
    if (block.id === parentId) {
      return { ...block, [branch]: change(block[branch] ?? []) };
    }
    const branches = getBranches(registry, block);
    if (!branches.length) {
      return block;
    }
    const changed = branches.map(key => [key, changeContainer(registry, block[key] ?? [], { parentId, branch }, change)]);
    return { ...block, ...Object.fromEntries(changed) };
  });
};

/** Replaces a block by `update(block)`, or merges `update` when it is an object. */
export const updateBlock = (registry, blocks, id, update) => {
  const location = findBlock(registry, blocks, id);
  if (!location) {
    return blocks;
  }
  return changeContainer(registry, blocks, location, container => container.map(block => {
    if (block.id !== id) {
      return block;
    }
    return typeof update === 'function' ? update(block) : { ...block, ...update };
  }));
};

export const removeBlock = (registry, blocks, id) => {
  const location = findBlock(registry, blocks, id);
  if (!location) {
    return blocks;
  }
  return changeContainer(registry, blocks, location, container => container.filter(block => block.id !== id));
};

/** Inserts a block at a place; at the end of the container without index. */
export const insertBlock = (registry, blocks, place, block) =>
  changeContainer(registry, blocks, place, container => {
    const index = place.index ?? container.length;
    return [...container.slice(0, index), block, ...container.slice(index)];
  });

/**
 * Whether a block (with its descendants) may go to a place:
 * accepted by its new parent, allowed by every ancestor, not inside itself,
 * and within the maximum depth.
 */
export const canPlace = (registry, blocks, block, { parentId }, { rootAccepts = () => true, maxDepth = Infinity } = {}) => {
  let parentType = null;
  let ancestors = [];
  let depth = 1;

  if (parentId !== null) {
    if (parentId === block.id || isInside(registry, block, parentId)) {
      return false;
    }
    const parent = findBlock(registry, blocks, parentId);
    if (!parent) {
      return false;
    }
    parentType = parent.block.type;
    ancestors = [...parent.ancestors, parentType];
    depth = parent.depth + 1;
  }

  const accepts = parentType === null ? rootAccepts : registry[parentType]?.accepts ?? (() => true);
  if (!accepts(block.type)) {
    return false;
  }

  const types = getTypes(registry, block);
  const excluded = ancestors.some(type =>
    (registry[type]?.excludesInside ?? []).some(excludedType => types.includes(excludedType)));
  if (excluded) {
    return false;
  }

  return depth - 1 + getHeight(registry, block) <= maxDepth;
};

/**
 * Moves a block to a place, given as it reads before the move (the index of
 * the block it is dropped on). Same result as arrayMove within a container.
 */
export const moveBlock = (registry, blocks, id, place) => {
  const location = findBlock(registry, blocks, id);
  if (!location || place.parentId === id || isInside(registry, location.block, place.parentId)) {
    return blocks;
  }
  const removed = removeBlock(registry, blocks, id);
  return insertBlock(registry, removed, place, location.block);
};
