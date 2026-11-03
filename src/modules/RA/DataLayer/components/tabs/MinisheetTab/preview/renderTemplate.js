import marked from 'marked';
import nunjucks from 'nunjucks';
import slugify from 'slugify';

const env = new nunjucks.Environment();
env.addFilter('slug', value => slugify(`${value || ''}`.toLowerCase()));
env.addFilter('formatNumber', (value, locale) => new Intl.NumberFormat(locale).format(value));

const defaultTrimFilter = env.getFilter('trim');
env.addFilter('trim', value => {
  try {
    return defaultTrimFilter(value);
  } catch {
    return '';
  }
});

/** HTML of a Nunjucks template rendered with the properties of an object. Throws on a template error. */
export const renderTemplate = (template, properties) => marked(env.renderString(template, properties));

export default renderTemplate;
