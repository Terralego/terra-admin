import React from 'react';
import { Link } from 'react-router-dom';
import { TopToolbar, Button } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconList from '@material-ui/icons/List';
import MapIcon from '@material-ui/icons/Map';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
/* eslint-enable */

/**
 * Same toolbar as DefaultActions, plus the switch that shows or hides the map
 * preview held in the aside.
 */
export const FormActions = ({
  basePath,
  redirect,
  previewOpen,
  onTogglePreview,
}) => (
  <TopToolbar>
    <Button
      onClick={onTogglePreview}
      label={previewOpen ? 'baseLayer.form.preview.hide' : 'baseLayer.form.preview.show'}
    >
      {previewOpen ? <MapIcon /> : <MapOutlinedIcon />}
    </Button>
    <Button
      component={Link}
      to={{ pathname: redirect || basePath }}
      variant="outlined"
      label={redirect ? 'ra.action.back' : 'ra.action.back-to-list'}
    >
      {redirect ? <IconArrowBack /> : <IconList />}
    </Button>
  </TopToolbar>
);

export default FormActions;
