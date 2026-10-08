import React from 'react';
import { Button } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import MapIcon from '@material-ui/icons/Map';
import MapOutlinedIcon from '@material-ui/icons/MapOutlined';
/* eslint-enable */

/**
 * Affiche ou masque l'aside d'aperçu des données. Rien tant qu'aucun aperçu
 * n'est disponible (source WMTS, type pas encore choisi).
 */
export const PreviewToggleButton = ({ available, open, onToggle }) => {
  if (!available) {
    return null;
  }

  return (
    <Button
      onClick={onToggle}
      label={open ? 'datasource.form.preview.hide' : 'datasource.form.preview.show'}
    >
      {open ? <MapIcon /> : <MapOutlinedIcon />}
    </Button>
  );
};

export default PreviewToggleButton;
