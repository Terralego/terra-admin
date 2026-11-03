const LEGACY_TYPES = new Set(['legacy-section', 'legacy-field']);

/** Envelope of the old wizard, kept so that Legacy blocks get their CSS. */
export const wrapLegacy = templates => `<div class="details">\n${templates.join('\n')}\n</div>\n`;

/**
 * Splits the blocks into what the minisheet renders, in order: consecutive
 * Legacy blocks share a single `details` envelope, an Expert block is
 * rendered as written, other types by their React component.
 */
export const toPreviewParts = (blocks = []) => {
  const parts = [];
  blocks.forEach(block => {
    const last = parts.at(-1);
    if (LEGACY_TYPES.has(block.type)) {
      if (last?.kind === 'legacy') {
        last.blocks.push(block);
      } else {
        parts.push({ kind: 'legacy', key: block.id, blocks: [block] });
      }
    } else if (block.type === 'expert') {
      parts.push({ kind: 'nunjucks', key: block.id, template: block.template ?? '' });
    } else {
      parts.push({ kind: 'block', key: block.id, block });
    }
  });

  return parts.map(part => (part.kind === 'legacy'
    ? { kind: 'nunjucks', key: part.key, template: wrapLegacy(part.blocks.map(({ template }) => template ?? '')) }
    : part));
};

export default toPreviewParts;
