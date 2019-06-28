import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Button, Popover, H5, PopoverInteractionKind, Classes } from '@blueprintjs/core';

import { generateURI } from '../../../config';
import { toast } from '../../../../../utils/toast';

class Actions extends React.Component {
  deleteFeature = () => {
    const {
      paramLayer,
      paramId,
      layer: { id: layerId },
      deleteFeature,
      history: { push },
      t,
    } = this.props;

    deleteFeature(layerId, paramId);
    toast.displayToaster(
      { id: paramId },
      t('rando.details.successDeleteFeature'),
      t('rando.details.failDeleteFeature'),
    );
    push(generateURI('layer', { layer: paramLayer }));
  }

  render () {
    const {
      paramLayer,
      paramId,
      displayUpdate,
      displayDelete,
      displayCancel,
      children,
      t,
    } = this.props;
    return (
      <div className="details__actions">
        {displayDelete && (
          <Popover
            popoverClassName={Classes.POPOVER_CONTENT_SIZING}
            interactionKind={PopoverInteractionKind.CLICK}
            className="details__actions-delete"
            content={(
              <div className="details__confirm">
                <H5>{t('rando.details.confirmDeletion')}</H5>
                <p>{t('rando.details.confirmDeletionText')}</p>
                <div className="details__confirm-content">
                  <Button
                    className={Classes.POPOVER_DISMISS}
                    text={t('rando.details.cancel')}
                  />
                  <Button
                    intent="danger"
                    className={Classes.POPOVER_DISMISS}
                    text={t('rando.details.delete')}
                    onClick={this.deleteFeature}
                  />
                </div>
              </div>
            )}
          >
            <Button icon="trash" intent="danger" text={t('rando.details.delete')} />
          </Popover>
        )}
        {displayUpdate && (
          <NavLink to={generateURI('layer', { layer: paramLayer, id: paramId, action: 'update' })}>
            <span className="bp3-button bp3-intent-primary">
              <Icon icon="edit" />
              <span className="bp3-button-text">{t('rando.details.update')}</span>
            </span>
          </NavLink>
        )}
        {displayCancel && (
          <NavLink to={generateURI('layer', { layer: paramLayer, id: paramId })}>
            <span className="bp3-button">
              <Icon icon="undo" />
              <span className="bp3-button-text">{t('rando.details.cancel')}</span>
            </span>
          </NavLink>
        )}
        {!!children && (
          <>{children}</>
        )}
      </div>
    );
  }
}

export default Actions;
