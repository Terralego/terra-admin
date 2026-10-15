import { canPlace } from '../../../../../../../components/BlockEditor/blockTree';
import { CATEGORIES, MAX_DEPTH, minisheetRegistry, rootAccepts } from '.';

const rules = { rootAccepts, maxDepth: MAX_DEPTH };
const block = (id, type, children) => ({ id, type, ...(children && { children }) });
const canGo = (blocks, moved, parentId) => canPlace(minisheetRegistry, blocks, moved, { parentId }, rules);

describe('minisheet nesting rules', () => {
  const blocks = [block('card', 'card', [block('text', 'typography')])];

  it('lets a card hold the modern blocks', () => {
    ['typography', 'alert', 'button', 'chart', 'expert'].forEach(type => {
      expect(canGo(blocks, block('new', type), 'card')).toBe(true);
    });
  });

  it('refuses a card or a Legacy block inside a card', () => {
    ['card', 'legacy-section', 'legacy-field'].forEach(type => {
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

  it('puts every type of block in a category of the menu', () => {
    const keys = CATEGORIES.map(({ key }) => key);
    Object.entries(minisheetRegistry).forEach(([, { category }]) => expect(keys).toContain(category));
  });
});
