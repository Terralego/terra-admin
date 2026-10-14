import React from 'react';
import { useTranslate } from 'react-admin';
import Typography from '@mui/material/Typography';

import CodeEditor from '../../../../../../../components/CodeEditor';
import NUNJUCKS_HTML, { isInsideTag, wordsHint } from '../../../../../../../components/CodeEditor/nunjucksMode';

const ExpertSettings = ({ block, onChange, context: { fields } }) => {
  const translate = useTranslate();
  const hint = React.useMemo(
    () => wordsHint(fields.filter(({ name }) => name).map(({ name, label }) => ({ text: name, description: label }))),
    [fields],
  );

  return (
    <>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ pt: 1, pb: 0.5 }}>
        {translate('datalayer.form.minisheet.blocks.expert-help')}
      </Typography>
      <CodeEditor
        value={block.template ?? ''}
        onChange={template => onChange({ template })}
        mode={NUNJUCKS_HTML}
        hint={hint}
        autoHint={isInsideTag}
      />
    </>
  );
};

/** Nunjucks written by hand, rendered as is. */
export const expert = {
  label: 'datalayer.form.minisheet.blocks.expert',
  create: () => ({ template: '' }),
  Settings: ExpertSettings,
  summary: block => (block.template ?? '').trim().split('\n')[0],
};

export default expert;
