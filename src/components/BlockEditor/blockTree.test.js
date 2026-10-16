/* oxlint-disable unicorn/no-thenable */
import {
  ROOT,
  canPlace,
  duplicateBlock,
  findBlock,
  getHeight,
  insertBlock,
  moveBlock,
  removeBlock,
  updateBlock,
} from './blockTree';

const registry = {
  'legacy-section': { branches: ['children'], accepts: type => type === 'legacy-field' },
  'legacy-field': {},
  card: {
    branches: ['children'],
    accepts: type => !['card', 'legacy-section', 'legacy-field'].includes(type),
    excludesInside: ['card', 'legacy-section', 'legacy-field'],
  },
  condition: { branches: ['then', 'else'], accepts: type => type !== 'legacy-field' },
  table: { branches: ['children'], accepts: type => type === 'field' },
  field: {},
  text: {},
};
const options = { maxDepth: 3 };
const at = parentId => ({ parentId, branch: 'children' });
const rootAccepts = type => type !== 'field';

const blocks = [
  { id: 'title', type: 'text' },
  { id: 'card', type: 'card', children: [{ id: 'a', type: 'field' }, { id: 'b', type: 'text' }] },
  {
    id: 'if',
    type: 'condition',
    then: [{ id: 'table', type: 'table', children: [{ id: 'c', type: 'field' }] }],
    else: [],
  },
  { id: 'section', type: 'legacy-section', children: [{ id: 'd', type: 'legacy-field' }] },
];

const ids = list => list.map(({ id }) => id);

describe('findBlock', () => {
  it('finds a block with its place, depth and ancestors', () => {
    expect(findBlock(registry, blocks, 'c')).toMatchObject({
      block: { id: 'c' },
      parentId: 'table',
      branch: 'children',
      index: 0,
      depth: 3,
      ancestors: ['condition', 'table'],
    });
    expect(findBlock(registry, blocks, 'card')).toMatchObject({ ...ROOT, index: 1, depth: 1 });
    expect(findBlock(registry, blocks, 'nope')).toBeNull();
  });

  it('measures the height of a block', () => {
    expect(getHeight(registry, blocks[0])).toBe(1);
    expect(getHeight(registry, blocks[2])).toBe(3);
  });
});

describe('updateBlock, removeBlock and insertBlock', () => {
  it('merges settings into a nested block', () => {
    const updated = updateBlock(registry, blocks, 'c', { label: 'Altitude' });

    expect(findBlock(registry, updated, 'c').block).toEqual({ id: 'c', type: 'field', label: 'Altitude' });
    expect(updated[0]).toBe(blocks[0]);
  });

  it('removes a nested block', () => {
    const removed = removeBlock(registry, blocks, 'a');

    expect(ids(findBlock(registry, removed, 'card').block.children)).toEqual(['b']);
  });

  it('inserts at an index, or at the end of a branch', () => {
    const block = { id: 'new', type: 'text' };

    expect(ids(insertBlock(registry, blocks, { ...ROOT, index: 1 }, block))).toEqual(['title', 'new', 'card', 'if', 'section']);
    const inElse = insertBlock(registry, blocks, { parentId: 'if', branch: 'else' }, block);
    expect(ids(findBlock(registry, inElse, 'if').block.else)).toEqual(['new']);
  });
});

describe('moveBlock', () => {
  it('reorders within a container as arrayMove does', () => {
    expect(ids(moveBlock(registry, blocks, 'title', { ...ROOT, index: 2 }))).toEqual(['card', 'if', 'title', 'section']);
    expect(ids(moveBlock(registry, blocks, 'if', { ...ROOT, index: 0 }))).toEqual(['if', 'title', 'card', 'section']);
  });

  it('moves a block to another container', () => {
    const moved = moveBlock(registry, blocks, 'b', { parentId: 'if', branch: 'else', index: 0 });

    expect(ids(findBlock(registry, moved, 'card').block.children)).toEqual(['a']);
    expect(ids(findBlock(registry, moved, 'if').block.else)).toEqual(['b']);
  });

  it('never moves a block inside itself', () => {
    expect(moveBlock(registry, blocks, 'if', { parentId: 'table', branch: 'children' })).toBe(blocks);
  });
});

describe('canPlace', () => {
  it('follows what the parent accepts', () => {
    expect(canPlace(registry, blocks, { id: 'x', type: 'legacy-field' }, at('section'), options)).toBe(true);
    expect(canPlace(registry, blocks, { id: 'x', type: 'text' }, at('section'), options)).toBe(false);
    expect(canPlace(registry, blocks, { id: 'x', type: 'text' }, at('table'), options)).toBe(false);
  });

  it('follows what the top level accepts', () => {
    expect(canPlace(registry, blocks, { id: 'x', type: 'field' }, ROOT, { rootAccepts })).toBe(false);
    expect(canPlace(registry, blocks, { id: 'x', type: 'text' }, ROOT, { rootAccepts })).toBe(true);
  });

  it('forbids a card anywhere inside a card', () => {
    const withCondition = insertBlock(registry, blocks, at('card'), { id: 'inner', type: 'condition', then: [], else: [] });
    const card = { id: 'x', type: 'card', children: [] };

    expect(canPlace(registry, withCondition, card, { parentId: 'inner', branch: 'then' }, options)).toBe(false);
    expect(canPlace(registry, withCondition, card, { parentId: 'if', branch: 'else' }, options)).toBe(true);
  });

  it('forbids a container holding an excluded type', () => {
    const condition = { id: 'x', type: 'condition', then: [{ id: 'y', type: 'card', children: [] }], else: [] };

    expect(canPlace(registry, blocks, condition, at('card'), options)).toBe(false);
  });

  it('keeps within the maximum depth', () => {
    const table = { id: 'x', type: 'table', children: [{ id: 'y', type: 'field' }] };

    expect(canPlace(registry, blocks, table, { parentId: 'if', branch: 'else' }, options)).toBe(true);
    expect(canPlace(registry, blocks, { id: 'x', type: 'field' }, at('table'), options)).toBe(true);
    const deep = { id: 'x', type: 'condition', then: [table], else: [] };
    expect(canPlace(registry, blocks, deep, { parentId: 'if', branch: 'else' }, options)).toBe(false);
  });

  it('forbids a block inside itself', () => {
    expect(canPlace(registry, blocks, blocks[2], at('table'), options)).toBe(false);
  });
});

describe('duplicateBlock', () => {
  const createId = (() => {
    let count = 0;
    return () => {
      count += 1;
      return `new${count}`;
    };
  })();

  it('puts a copy of a container, with new ids for all it holds, right below it', () => {
    const { blocks: result, copy } = duplicateBlock(registry, blocks, 'if', createId);
    expect(result.map(({ id }) => id)).toEqual([...blocks.map(({ id }) => id).slice(0, 3), copy.id, ...blocks.map(({ id }) => id).slice(3)]);
    expect(copy).toEqual({
      id: 'new1',
      type: 'condition',
      then: [{ id: 'new2', type: 'table', children: [{ id: 'new3', type: 'field' }] }],
      else: [],
    });
  });

  it('copies a block inside its container', () => {
    const { blocks: result } = duplicateBlock(registry, blocks, 'a', createId);
    expect(findBlock(registry, result, 'card').block.children.map(({ type }) => type)).toEqual(['field', 'field', 'text']);
  });
});
