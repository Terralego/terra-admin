import React from 'react';
import { Button, Popover, Classes, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { generateURI } from '../../../config';

class CellRender extends React.Component {
  state = {
    isOpen: undefined,
  }

  togglePopover = value => this.setState({ isOpen: value })

  render () {
    const { isOpen } = this.state;
    const {
      featuresList = [],
      layer, children: contentCell,
      originalRowIndex,
      displayViewFeature,
      displayUpdateFeature,
    } = this.props;

    const { identifier: id } = featuresList[originalRowIndex] || {};

    if (contentCell === '' || !featuresList.length || !displayViewFeature || !id) {
      return contentCell;
    }

    return (
      <div className="table__cell-wrapper">
        <Popover
          className="table__cell-popover"
          popoverClassName={`${Classes.POPOVER_CONTENT_SIZING} ${Classes.POPOVER_DISMISS}`}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.TOP}
          isOpen={isOpen}
          content={
            displayUpdateFeature ? (
              <Trans
                i18nKey="rando.table.readOrUpdateMessage"
              >
                <NavLink
                  className={Classes.POPOVER_DISMISS}
                  to={generateURI('layer', { layer, id })}
                  onClick={() => this.togglePopover(false)}
                >
                Read
                </NavLink>
                or
                <NavLink
                  className={Classes.POPOVER_DISMISS}
                  to={generateURI('layer', { layer, id, action: 'update' })}
                  onClick={() => this.togglePopover(false)}
                >
                Update
                </NavLink>
                this feature
              </Trans>
            ) : (
              <Trans
                i18nKey="rando.table.readMessage"
              >
                <NavLink
                  className={Classes.POPOVER_DISMISS}
                  to={generateURI('layer', { layer, id })}
                  onClick={() => this.togglePopover(false)}
                >
              Read
                </NavLink>
              this feature
              </Trans>
            )}

        >
          <Button
            className="table__cell-target"
            minimal
            small
            onClick={() => this.togglePopover(undefined)}
          >
            {contentCell}
          </Button>
        </Popover>
      </div>
    );
  }
}

export default CellRender;
