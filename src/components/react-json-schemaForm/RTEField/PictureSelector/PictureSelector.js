import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Classes, Elevation, H5, Intent, Overlay } from '@blueprintjs/core';

import ImportFile from '../../../../modules/CRUD/components/Details/Read/AttachmentView/ImportFile';
import CategoryList from '../../../../modules/CRUD/components/Details/Read/AttachmentView/CategoryList';

import './styles.scss';

const PictureSelector = ({ onClose, onSubmit, t }) => {
  const [selected, setSelected] = useState(undefined);

  return (
    <Overlay
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      elevation={Elevation.TWO}
      isOpen
    >
      <div className="picture-selector">
        <Card>
          <header className="picture-selector__header">
            <H5>{t('jsonSchema.RTEField.pick-image')}</H5>
            <Button minimal icon="small-cross" title={t('jsonSchema.RTEField.close')} onClick={onClose} />
          </header>
          <CategoryList name="pictures" selectable onSelection={value => setSelected(value)} />
          <ImportFile name="pictures" />
          <footer className="picture-selector__footer">
            <Button
              icon="bring-data"
              intent={Intent.PRIMARY}
              disabled={!selected}
              onClick={() => onSubmit(selected)}
              type="submit"
            >
              {t('jsonSchema.RTEField.pick-image')}
            </Button>
          </footer>
        </Card>
      </div>
    </Overlay>
  );
};

PictureSelector.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  t: PropTypes.func,
};

PictureSelector.defaultProps = {
  onClose: () => {},
  onSubmit: () => {},
  t: text => text,
};

export default PictureSelector;
