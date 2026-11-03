import { canPlace } from '../../../../../../../components/BlockEditor/blockTree';
import { CATEGORIES, minisheetRegistry, rootAccepts } from '.';

const rules = { rootAccepts };
const block = (id, type, children) => ({ id, type, ...(children && { children }) });
const canGo = (blocks, moved, parentId) => canPlace(minisheetRegistry, blocks, moved, { parentId }, rules);

describe('minisheet nesting rules', () => {
  const blocks = [block('card', 'card', [block('text', 'typography')])];

  it('lets a card hold the modern blocks', () => {
    ['typography', 'alert', 'button', 'chart', 'expert'].forEach(type => {
      expect(canGo(blocks, block('new', type), 'card')).toBe(true);
    });
  });

  it('lets a card hold a card, but no Legacy block', () => {
    expect(canGo(blocks, block('new', 'card'), 'card')).toBe(true);
    ['legacy-section', 'legacy-field'].forEach(type => {
      expect(canGo(blocks, block('new', type), 'card')).toBe(false);
    });
  });

  it('lets an accordion hold a card, but no Legacy block', () => {
    const tree = [block('acc', 'accordion', [])];
    expect(canGo(tree, block('new', 'card'), 'acc')).toBe(true);
    expect(canGo(tree, block('new', 'divider'), 'acc')).toBe(true);
    expect(canGo(tree, block('new', 'legacy-field'), 'acc')).toBe(false);
  });

  it('lets a repeat hold a card with a field and an image, but no Nunjucks block nor repeat', () => {
    const tree = [block('rep', 'repeat', [block('card', 'card', [])])];
    ['field', 'image'].forEach(type => expect(canGo(tree, block('new', type), 'card')).toBe(true));
    ['expert', 'legacy-field', 'repeat'].forEach(type => {
      expect(canGo(tree, block('new', type), 'rep')).toBe(false);
    });
    expect(canGo(tree, block('new', 'repeat'), 'card')).toBe(false);
  });

  it('lets a condition hold what the top level holds, but a Legacy field only in a section', () => {
    // eslint-disable-next-line unicorn/no-thenable
    const tree = [{ id: 'cond', type: 'condition', then: [], else: [] }];
    ['card', 'repeat', 'expert', 'legacy-section'].forEach(type => {
      expect(canGo(tree, block('new', type), 'cond')).toBe(true);
    });
    expect(canGo(tree, block('new', 'legacy-field'), 'cond')).toBe(false);
  });

  it('keeps a condition inside a repeat free of what the repeat refuses', () => {
    // eslint-disable-next-line unicorn/no-thenable
    const tree = [block('rep', 'repeat', [{ id: 'cond', type: 'condition', then: [], else: [] }])];
    expect(canGo(tree, block('new', 'field'), 'cond')).toBe(true);
    ['expert', 'repeat', 'legacy-section'].forEach(type => expect(canGo(tree, block('new', type), 'cond')).toBe(false));
  });

  it('nests blocks without a limit of depth', () => {
    const tree = [block('a', 'card', [block('r', 'repeat', [block('b', 'card', [block('c', 'card', [])])])])];
    expect(canGo(tree, block('new', 'field'), 'c')).toBe(true);
  });

  it('puts every type of block in a category of the menu', () => {
    const keys = CATEGORIES.map(({ key }) => key);
    Object.entries(minisheetRegistry).forEach(([, { category }]) => expect(keys).toContain(category));
  });
});
