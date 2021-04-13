import React, { useState, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Classes, H5, Intent, Overlay } from '@blueprintjs/core';
import ImportGeomFileOverlay from './ImportGeomFileOverlay';
import { GeometryFieldContext } from '../react-json-schemaForm/GeometryField/GeometryFieldProvider';
import './styles.scss';


const ImportGeomFile = props => {
  const [open, setOpen] = useState(false);
  const [features, setFeatures] = useState(null);
  const toggleOverlay = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const {
    setFeaturesToFitBounds,
  } = useContext(GeometryFieldContext);

  const handleSubmit = useCallback(() => {
    setFeaturesToFitBounds(features);
    setOpen(false);
  }, [features, setFeaturesToFitBounds]);

  const { t } = useTranslation();
  const acceptedExtensions = ['gpx', 'kml'];

  return (
    <div className="importGeomFile">
      <p className="control-label">{t('importGeomFile.title')}</p>
      <Button icon="upload" onClick={toggleOverlay}>
        {t('importGeomFile.button', { accept: acceptedExtensions.join(',') })}
      </Button>
      <Overlay
        className={`${Classes.OVERLAY_SCROLL_CONTAINER} importGeomFileOverlay`}
        isOpen={open}
        onClose={toggleOverlay}
      >
        <Card>
          <H5>{t('importGeomFile.title')}</H5>
          <div className="importGeomFileOverlay__content">
            <ImportGeomFileOverlay
              {...props}
              onChange={setFeatures}
              toggleOverlay={toggleOverlay}
              acceptedExtensions={acceptedExtensions}
            />
          </div>
          <div className="importGeomFileOverlay__actions">
            <Button minimal onClick={toggleOverlay}>{t('common.cancel')}</Button>
            <Button
              disabled={!features?.length}
              icon="upload"
              intent={Intent.PRIMARY}
              onClick={handleSubmit}
            >
              {t('importGeomFile.submit')}
            </Button>
          </div>
        </Card>
      </Overlay>
    </div>
  );
};

export default ImportGeomFile;
