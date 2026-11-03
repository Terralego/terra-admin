import React from 'react';
import { Link } from 'react-router-dom';
import { TopToolbar, Button } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import IconArrowBack from '@material-ui/icons/ArrowBack';
import IconList from '@material-ui/icons/List';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
/* eslint-enable */

/**
 * Same toolbar as DefaultActions, plus the switch that shows or hides the
 * minisheet preview held in the aside, when the minisheet tab is open.
 */
export const DataLayerActions = ({
  basePath,
  redirect,
  previewAvailable,
  previewOpen,
  onTogglePreview,
}) => (
  <TopToolbar>
    {previewAvailable && (
      <Button
        onClick={onTogglePreview}
        label={previewOpen
          ? 'datalayer.form.minisheet.preview.hide'
          : 'datalayer.form.minisheet.preview.show'}
      >
        {previewOpen ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </Button>
    )}
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

export default DataLayerActions;
