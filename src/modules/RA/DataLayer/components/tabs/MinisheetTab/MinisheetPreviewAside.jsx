import React from 'react';
import { useTranslate } from 'react-admin';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';

/* eslint-disable import/no-extraneous-dependencies */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
/* eslint-enable */

import MinisheetPreview from './preview/MinisheetPreview';
import createSampleData from './preview/sampleData';

const useStyles = makeStyles(theme => ({
  root: {
    alignSelf: 'flex-start',
    border:    `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.up('lg')]: {
      flex:       '0 0 32em',
      minWidth:   0,
      marginLeft: '1em',
      position:   'sticky',
      top:        theme.spacing(2),
      display:       'flex',
      flexDirection: 'column',
      maxHeight:     `calc(100vh - ${theme.spacing(4)}px)`,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: '1em',
    },
  },
  content: {
    flex:      1,
    minHeight: 0,
    overflow:  'auto',
  },
  json: {
    margin:   0,
    fontSize: '0.75rem',
  },
}));

const parse = text => {
  try {
    const value = JSON.parse(text);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
};

/**
 * Aside of the minisheet tab: the minisheet rendered on example data, the
 * example data themselves, editable, and the config as it would be saved.
 */
export const MinisheetPreviewAside = ({ preview: { config, fields, sampleText, setSampleText } }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [tab, setTab] = React.useState('render');

  const generated = React.useMemo(() => createSampleData(fields), [fields]);
  const text = sampleText ?? JSON.stringify(generated, null, 2);
  const edited = sampleText === null ? generated : parse(sampleText);
  const properties = edited ?? generated;

  return (
    <Card elevation={0} className={`${classes.root} sticky-aside`}>
      <CardHeader
        title={translate('datalayer.form.minisheet.preview.title')}
        titleTypographyProps={{ variant: 'subtitle1' }}
      />
      <Tabs value={tab} onChange={(event, value) => setTab(value)} variant="fullWidth">
        <Tab value="render" label={translate('datalayer.form.minisheet.preview.render')} />
        <Tab value="data" label={translate('datalayer.form.minisheet.preview.data')} />
        <Tab value="json" label={translate('datalayer.form.minisheet.preview.json')} />
      </Tabs>
      <Divider />
      <CardContent className={classes.content}>
        {tab === 'render' && <MinisheetPreview config={config} properties={properties} />}
        {tab === 'data' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              multiline
              fullWidth
              minRows={8}
              maxRows={30}
              value={text}
              onChange={event => setSampleText(event.target.value)}
              error={!edited}
              helperText={translate(edited
                ? 'datalayer.form.minisheet.preview.data-help'
                : 'datalayer.form.minisheet.preview.data-invalid')}
              sx={{ '& textarea': { fontFamily: 'monospace', fontSize: '0.75rem' } }}
            />
            <Button
              size="small"
              disabled={sampleText === null}
              onClick={() => setSampleText(null)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {translate('datalayer.form.minisheet.preview.data-reset')}
            </Button>
          </Box>
        )}
        {tab === 'json' && <pre className={classes.json}>{JSON.stringify(config, null, 2)}</pre>}
      </CardContent>
    </Card>
  );
};

export default MinisheetPreviewAside;
