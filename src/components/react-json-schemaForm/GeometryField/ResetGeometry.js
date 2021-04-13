import React, { useContext } from 'react';
import { Button, Classes, H5, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { GeometryFieldContext } from './GeometryFieldProvider';

const ResetGeometry = props => {
  const { resetFeatureCollection } = useContext(GeometryFieldContext);
  const { t } = useTranslation();

  const onReset = () => {
    resetFeatureCollection();
  };

  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      interactionKind={PopoverInteractionKind.CLICK}
      content={(
        <div className="details__confirm">
          <H5>{t('jsonSchema.geometryField.reset.confirmation')}</H5>
          <div className="details__confirm-content">
            <Button
              className={Classes.POPOVER_DISMISS}
              text={t('common.cancel')}
            />
            <Button
              className={Classes.POPOVER_DISMISS}
              intent="danger"
              onClick={onReset}
              text={t('form.reset')}
            />
          </div>
        </div>
      )}
    >
      <Button
        intent="danger"
        minimal
        {...props}
      >
        {t('jsonSchema.geometryField.reset.label')}
      </Button>
    </Popover>
  );
};

export default ResetGeometry;
