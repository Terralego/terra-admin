import React from 'react';
import { Divider, Typography } from '@material-ui/core';
import { useTranslate } from 'ra-core';

function DataSettingsTitle () {
  const translate = useTranslate();
  return (
    <>
      <Divider />
      <Typography>{translate('resources.datalayer.widgets-editor.data')}</Typography>
    </>
  );
}

export default DataSettingsTitle;
