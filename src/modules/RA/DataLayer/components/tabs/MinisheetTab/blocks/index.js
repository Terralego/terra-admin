import accordion from './accordion';
import alert from './alert';
import button from './button';
import card from './card';
import chart from './chart';
import condition from './condition';
import divider from './divider';
import expert from './expert';
import field from './field';
import iframe from './iframe';
import image from './image';
import legacyField from './legacyField';
import legacySection from './legacySection';
import repeat from './repeat';
import typography from './typography';

/**
 * Types of minisheet blocks, as described by the data contract. The nesting
 * rules come along with each type (see components/BlockEditor/blockTree).
 */
export const minisheetRegistry = {
  'legacy-section': legacySection,
  'legacy-field': legacyField,
  expert,
  field,
  typography,
  card,
  repeat,
  alert,
  button,
  image,
  iframe,
  accordion,
  divider,
  chart,
  condition,
};

export const rootAccepts = () => true;

export const CATEGORIES = ['content', 'layout', 'media', 'advanced', 'legacy']
  .map(key => ({ key, label: `datalayer.form.minisheet.categories.${key}` }));

export default minisheetRegistry;
