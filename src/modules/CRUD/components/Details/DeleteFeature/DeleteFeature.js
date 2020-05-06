import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import ConfirmDeletion from '../../../../../components/ConfirmDeletion';
import { generateURI } from '../../../config';
import { toast } from '../../../../../utils/toast';

const DeleteFeature = ({
  deleteFeature,
  displayDelete,
  feature: { title },
  getSettings,
  history: { push },
  match: { params: { id, layer } },
  settingsEndpoint,
  t,
  view: { featureEndpoint, objectName },
}) => {
  const handleDeleteFeature = useCallback(async () => {
    const deleted = await deleteFeature(featureEndpoint, id);

    toast.displayToaster(
      deleted ? { id: deleted } : {},
      t('CRUD.details.successDeleteFeature'),
      t('CRUD.details.failDeleteFeature'),
    );

    if (!deleted) {
      return;
    }

    await getSettings(settingsEndpoint);

    push(generateURI('layer', { layer }));
  }, [deleteFeature, featureEndpoint, getSettings, id, layer, push, settingsEndpoint, t]);

  if (!displayDelete) {
    return null;
  }

  return (
    <ConfirmDeletion
      confirmationText={t('CRUD.details.confirmDeletionText', { name: `<strong>${title}</strong>` })}
      onDelete={handleDeleteFeature}
      submitText={t('common.delete', { name: objectName })}
    />
  );
};


DeleteFeature.propTypes = {
  deleteFeature: PropTypes.func,
  displayDelete: PropTypes.bool,
  feature: PropTypes.shape({
    title: PropTypes.string,
  }),
  getSettings: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      layer: PropTypes.string,
    }),
  }),
  settingsEndpoint: PropTypes.string,
  t: PropTypes.func,
  view: PropTypes.shape({
    featureEndpoint: PropTypes.string,
  }),
};

DeleteFeature.defaultProps = {
  deleteFeature () {},
  displayDelete: false,
  feature: {
    title: undefined,
  },
  getSettings () {},
  history: {
    push () {},
  },
  match: {
    params: {
      id: undefined,
      layer: undefined,
    },
  },
  settingsEndpoint: undefined,
  t: text => text,
  view: {
    featureEndpoint: undefined,
    objectName: undefined,
  },
};

export default DeleteFeature;
