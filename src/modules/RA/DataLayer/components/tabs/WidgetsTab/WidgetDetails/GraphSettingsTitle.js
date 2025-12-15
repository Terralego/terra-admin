import React from 'react';
import { Divider, Typography } from '@material-ui/core';
import { useTranslate } from 'ra-core';

function GraphSettingsTitle () {
  const translate = useTranslate();
  return (
    <>
      <Divider />
      <Typography>{translate('resources.datalayer.widgets-editor.graph.title')}</Typography>
    </>
  );
}

export default GraphSettingsTitle;
