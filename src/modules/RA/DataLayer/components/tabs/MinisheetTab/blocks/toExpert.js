/* eslint-disable import/no-extraneous-dependencies */
import CodeIcon from '@material-ui/icons/Code';
/* eslint-enable */

import { withLegacyTemplates } from '../minisheetBlocks';
import { wrapLegacy } from '../preview/previewParts';

/**
 * Action of the Legacy blocks: becomes an Expert block holding the Nunjucks
 * they generate, in their envelope, so that it renders the same. Only offered
 * where an Expert block may stand (not inside a Legacy section).
 */
export const toExpert = {
  label: 'datalayer.form.minisheet.blocks.to-expert',
  icon: CodeIcon,
  run: (block, { fields, translate }) => {
    const [{ template }] = withLegacyTemplates([block], fields, translate);
    return { id: block.id, type: 'expert', template: wrapLegacy([template]) };
  },
};

export default toExpert;
