import React from 'react';
import { useTranslate } from 'react-admin';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import blockComponents from './blocks';
import renderTemplate from './renderTemplate';
import toPreviewParts from './previewParts';

const detailsStyles = {
  '& .details': { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  '& .details__title': { textAlign: 'center', fontSize: '1.6rem', fontWeight: 300 },
  '& .details__group': { marginTop: '8px' },
  '& .details__list': { padding: 0, margin: 0, display: 'flex', flexDirection: 'column' },
  '& .details__list__amenity': { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 0 },
  '& .details__list__amenity__img': { width: '36px', height: '36px' },
  '& .details__times': { display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: 0 },
  '& .details__column': { display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' },
  '& .details__column-label': { paddingBottom: '8px', paddingRight: '8px', whiteSpace: 'nowrap', opacity: 0.65 },
  '& .details__column-value': { minWidth: '40%', paddingBottom: '10px', overflowWrap: 'anywhere', wordBreak: 'break-word' },
  '& .details__link': {
    marginTop: '56px',
    textAlign: 'center',
    '& a': { background: '#fff', padding: '12px', border: '1px solid rgba(10, 6, 77, 0.35)' },
  },
  '& .details__subtitle': { color: 'primary.dark', fontWeight: 700, opacity: 0.8 },
};

const Title = ({ title, properties }) => {
  if (!title) {
    return null;
  }
  const text = (title.field && properties[title.field]) || title.default;

  return (
    <Typography
      component="h2"
      sx={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
    >
      {title.icon && <Box component="img" src={title.icon} alt="" sx={{ height: '1.6rem' }} />}
      {text}
    </Typography>
  );
};

const BlockPart = ({ block, properties }) => {
  const translate = useTranslate();
  const Component = blockComponents[block.type];

  if (!Component) {
    return <Alert severity="info">{translate('datalayer.form.minisheet.preview.unsupported', { type: block.type })}</Alert>;
  }
  // eslint-disable-next-line no-use-before-define
  return <Component block={block} properties={properties} Blocks={Blocks} />;
};

const NunjucksPart = ({ template, properties }) => {
  const translate = useTranslate();
  let html;
  try {
    html = renderTemplate(template, properties);
  } catch (error) {
    return (
      <Alert severity="error">
        {translate('datalayer.form.minisheet.preview.render-error')}
        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', m: 0 }}>{error.message}</Box>
      </Alert>
    );
  }
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

/** Blocks in order, at the top level or inside a container block. */
const Blocks = ({ blocks, properties }) => toPreviewParts(blocks).map(part => (part.kind === 'nunjucks'
  ? <NunjucksPart key={part.key} template={part.template} properties={properties} />
  : <BlockPart key={part.key} block={part.block} properties={properties} />));

/**
 * The minisheet as the front would show it, for given object properties:
 * the title, then each block in order.
 */
export const MinisheetPreview = ({ config, properties }) => (
  <Box sx={{ ...detailsStyles, display: 'flex', flexDirection: 'column', gap: 2 }}>
    <Title title={config?.title} properties={properties} />
    <Blocks blocks={config?.blocks} properties={properties} />
  </Box>
);

export default MinisheetPreview;
