import React from 'react';
import { Link } from 'react-router-dom';
import { TopToolbar, Button } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import IconList from '@material-ui/icons/List';
/* eslint-enable */

import PreviewToggleButton from './PreviewToggleButton';

/**
 * Même barre que DefaultActions, plus l'interrupteur de l'aperçu des données.
 */
export const CreateActions = ({
  basePath,
  previewAvailable,
  previewOpen,
  onTogglePreview,
}) => (
  <TopToolbar>
    <PreviewToggleButton
      available={previewAvailable}
      open={previewOpen}
      onToggle={onTogglePreview}
    />
    <Button
      component={Link}
      to={{ pathname: basePath }}
      variant="outlined"
      label="ra.action.back-to-list"
    >
      <IconList />
    </Button>
  </TopToolbar>
);

export default CreateActions;
