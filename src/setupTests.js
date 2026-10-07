// jsdom n'implémente pas la mesure des Range : sans ces deux méthodes,
// CodeMirror échoue dès qu'il tente de positionner son curseur.
const emptyRect = {
  top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, x: 0, y: 0,
};

if (typeof Range !== 'undefined') {
  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => ({ ...emptyRect });
  }
  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () => Object.assign([], { item: () => null });
  }
}
