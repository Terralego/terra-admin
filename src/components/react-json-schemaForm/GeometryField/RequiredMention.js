import React, { useContext, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { GeometryFieldContext } from './GeometryFieldProvider';

const RequiredMention = () => {
  const { t } = useTranslation();
  const {
    isRequiredInEditView,
  } = useContext(GeometryFieldContext);

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
