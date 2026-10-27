import { isInsideTag, wordsHint } from './nunjucksMode';

const editorAt = (line, ch) => ({ getCursor: () => ({ line: 0, ch }), getLine: () => line });

describe('isInsideTag', () => {
  it('tells whether the cursor stands inside a tag', () => {
    expect(isInsideTag('<p>{{ nom')).toBe(true);
    expect(isInsideTag('{% if alt')).toBe(true);
    expect(isInsideTag('<p>{{ nom }} et ')).toBe(false);
    expect(isInsideTag('<p>texte')).toBe(false);
  });
});

describe('wordsHint', () => {
  const hint = wordsHint([
    { text: 'nom_site', description: 'Nom' },
    { text: 'altitude', description: 'Altitude' },
    { text: 'nombre' },
  ]);

  it('offers the words starting like the one before the cursor', () => {
    const { list, from, to } = hint(editorAt('{{ No', 5));

    expect(list).toEqual([
      { text: 'nom_site', displayText: 'nom_site — Nom' },
      { text: 'nombre', displayText: 'nombre' },
    ]);
    expect(from.ch).toBe(3);
    expect(to.ch).toBe(5);
  });
});
