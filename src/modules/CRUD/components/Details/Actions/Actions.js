import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon, Button, Popover, H5, PopoverInteractionKind, Classes } from '@blueprintjs/core';

import { generateURI } from '../../../config';
import { toast } from '../../../../../utils/toast';

class Actions extends React.Component {
  static propTypes = {
    paramLayer: PropTypes.string.isRequired,
    paramId: PropTypes.string,
    view: PropTypes.shape({
      layer: PropTypes.shape({
        id: PropTypes.number,
      }),
    }),
    t: PropTypes.func,
    deleteFeature: PropTypes.func,
    getSettings: PropTypes.func,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
    settingsEndpoint: PropTypes.string,
    displayUpdate: PropTypes.bool,
    displayDelete: PropTypes.bool,
    displayCancel: PropTypes.bool,
  }

  static defaultProps = {
    deleteFeature () { return undefined; },
    getSettings () { return undefined; },
    paramId: undefined,
    view: {
      layer: {
        id: undefined,
      },
    },
    history: {
      push () {},
    },
    settingsEndpoint: undefined,
    displayUpdate: false,
    displayDelete: false,
    displayCancel: false,
    t: text => text,
  }

  deleteFeature = async () => {
    const {
      getSettings,
      paramLayer,
      paramId,
      view: { featureEndpoint },
      deleteFeature,
      history: { push },
      settingsEndpoint,
      t,
    } = this.props;

    const deleted = await deleteFeature(featureEndpoint, paramId);

    toast.displayToaster(
      deleted ? { id: deleted } : {},
      t('CRUD.details.successDeleteFeature'),
      t('CRUD.details.failDeleteFeature'),
    );

    if (!deleted) {
      return;
    }

    await getSettings(settingsEndpoint);

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
                <H5>{t('CRUD.details.confirmDeletion')}</H5>
                <p>{t('CRUD.details.confirmDeletionText')}</p>
                <div className="details__confirm-content">
                  <Button
                    className={Classes.POPOVER_DISMISS}
                    text={t('CRUD.details.cancel')}
                  />
                  <Button
                    intent="danger"
                    className={Classes.POPOVER_DISMISS}
                    text={t('CRUD.details.delete')}
                    onClick={this.deleteFeature}
                  />
                </div>
              </div>
            )}
          >
            <Button icon="trash" intent="danger" text={t('CRUD.details.delete')} />
          </Popover>
        )}
        {displayUpdate && (
          <NavLink to={generateURI('layer', { layer: paramLayer, id: paramId, action: 'update' })}>
            <span className="bp3-button bp3-intent-primary">
              <Icon icon="edit" />
              <span className="bp3-button-text">{t('CRUD.details.update')}</span>
            </span>
          </NavLink>
        )}
        {displayCancel && (
          <NavLink to={generateURI('layer', { layer: paramLayer, id: paramId })}>
            <span className="bp3-button">
              <Icon icon="undo" />
              <span className="bp3-button-text">{t('CRUD.details.cancel')}</span>
            </span>
          </NavLink>
        )}
        {children}
      </div>
    );
  }
}

export default Actions;
