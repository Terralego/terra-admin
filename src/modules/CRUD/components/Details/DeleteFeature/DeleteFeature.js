import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, H5, PopoverInteractionKind, Classes } from '@blueprintjs/core';

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
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      interactionKind={PopoverInteractionKind.CLICK}
      content={(
        <div className="details__confirm">
          <H5>{t('CRUD.details.confirmDeletion')}</H5>
          {/* eslint-disable-next-line react/no-danger */}
          <p dangerouslySetInnerHTML={{ __html: t('CRUD.details.confirmDeletionText', { name: `<strong>${title}</strong>` }) }} />
          <div className="details__confirm-content">
            <Button
              className={Classes.POPOVER_DISMISS}
              text={t('CRUD.details.cancel')}
            />
            <Button
              className={Classes.POPOVER_DISMISS}
              intent="danger"
              onClick={handleDeleteFeature}
              text={t('CRUD.details.delete', { name: objectName })}
            />
          </div>
        </div>
      )}
    >
      <Button
        className="details__delete-feature"
        icon="trash"
        intent="danger"
        minimal
        text={t('CRUD.details.delete', { name: objectName })}
        title={t('CRUD.details.delete', { name: objectName })}
      />
    </Popover>
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
