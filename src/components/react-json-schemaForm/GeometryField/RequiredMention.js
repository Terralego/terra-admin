import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGeometryField } from './GeometryFieldProvider';

const RequiredMention = () => {
  const { t } = useTranslation();
  const {
    isRequiredInEditView,
  } = useGeometryField();

  if (!isRequiredInEditView) {
    return null;
  }
  return (
    <span className="details__list-edit-mandatory details__list-edit-mandatory--edit">
      {t('CRUD.details.mandatory')}
    </span>
  );
};

export default memo(RequiredMention);
