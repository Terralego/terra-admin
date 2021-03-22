import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Card, Classes, H5, Intent, Overlay } from '@blueprintjs/core';
import ImportGeomFileOverlay from './ImportGeomFileOverlay';
import './styles.scss';


const ImportGeomFile = ({ onSubmit, ...props }) => {
  const [open, setOpen] = useState(false);
  const [features, setFeatures] = useState(null);
  const toggleOverlay = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleSubmit = useCallback(() => {
    onSubmit(features);
    setOpen(false);
  }, [features, onSubmit]);

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


ImportGeomFile.propTypes = {
  onSubmit: PropTypes.func,
};

ImportGeomFile.defaultProps = {
  onSubmit () {},
};

export default ImportGeomFile;
