import tinycolor from 'tinycolor2';

import { formatColor } from './ColorPicker';

const RED = { r: 255, g: 0, b: 0 };

describe('formatColor', () => {
  it('writes an opaque colour as hex for the palettes', () => {
    expect(formatColor(tinycolor({ ...RED, a: 1 }), 'hex')).toBe('#ff0000');
  });

  it('keeps the transparency the hex format would drop', () => {
    expect(formatColor(tinycolor({ ...RED, a: 0.5 }), 'hex')).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('keeps the historical hsl format elsewhere', () => {
    expect(formatColor(tinycolor({ ...RED, a: 0.5 }), 'hsl')).toBe('hsla(0, 100%, 50%, 0.5)');
  });
});
