const PLACEHOLDER = /\{\{\s*([^{}]+?)\s*\}\}/g;

/**
 * Text of a block with `{{field}}` replaced by the value of the field. A
 * missing value gives an empty string. Not Nunjucks: no filter, no logic.
 */
export const interpolate = (text, properties = {}) =>
  (text ?? '').replace(PLACEHOLDER, (_, name) => {
    const value = properties[name];
    return value === null || value === undefined ? '' : String(value);
  });

const SAFE_HREF = /^(https?:|mailto:|tel:|\/|#|\?)/i;

/** A link with values of fields inserted, or null unless http(s), mailto, tel or relative. */
export const interpolateHref = (href, properties) => {
  const link = interpolate(href, properties).trim();
  return SAFE_HREF.test(link) ? link : null;
};

export default interpolate;
