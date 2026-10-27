import React from 'react';
import Box from '@mui/material/Box';

import CodeEditor from '../../../../../../../components/CodeEditor';
import NUNJUCKS_HTML, { isInsideTag, wordsHint } from '../../../../../../../components/CodeEditor/nunjucksMode';

const ExpertSettings = ({ block, onChange, context: { fields } }) => {
  const hint = React.useMemo(
    () => wordsHint(fields.filter(({ name }) => name).map(({ name, label }) => ({ text: name, description: label }))),
    [fields],
  );

  return (
    <Box sx={{ pt: 1 }}>
      <CodeEditor
        value={block.template ?? ''}
        onChange={template => onChange({ template })}
        mode={NUNJUCKS_HTML}
        hint={hint}
        autoHint={isInsideTag}
      />
    </Box>
  );
};

/** Nunjucks written by hand, rendered as is. */
export const expert = {
  label: 'datalayer.form.minisheet.blocks.expert',
  category: 'advanced',
  create: () => ({ template: '' }),
  Settings: ExpertSettings,
  summary: block => (block.template ?? '').trim().split('\n')[0],
};

export default expert;
