import chart from './chart';
import expert from './expert';
import legacyField from './legacyField';
import legacySection from './legacySection';

/**
 * Types of minisheet blocks, as described by the data contract. The nesting
 * rules come along with each type (see components/BlockEditor/blockTree).
 */
export const minisheetRegistry = {
  'legacy-section': legacySection,
  'legacy-field': legacyField,
  expert,
  chart,
};

export const rootAccepts = () => true;

export const MAX_DEPTH = 3;

export default minisheetRegistry;
