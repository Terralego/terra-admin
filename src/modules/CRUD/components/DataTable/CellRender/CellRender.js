import React from 'react';
import { Button, Popover, Classes, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Trans } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { generateURI } from '../../../config';

class CellRender extends React.Component {
  state = {
    isOpen: undefined,
  }

  togglePopover = isOpen => this.setState({ isOpen })

  render () {
    const { isOpen } = this.state;
    const {
      featuresList: { results = [] } = {},
      layer, children: contentCell,
      originalRowIndex,
      displayViewFeature,
      displayUpdateFeature,
      onHoverCell = () => null,
    } = this.props;

    const { identifier: id } = results[originalRowIndex] || {};

    if (!results.length || !id) {
      return contentCell;
    }

    const CellTarget = () => (
      <Button
        className="table__cell-target"
        minimal
        small
        onClick={() => this.togglePopover(undefined)}
      >
        {contentCell}
      </Button>
    );

    return (
      <div
        className="table__cell-wrapper"
        onMouseOver={() => onHoverCell(id)}
        onFocus={() => onHoverCell(id)}
        onMouseOut={() => onHoverCell(id, false)}
        onBlur={() => onHoverCell(id, false)}
      >
        {!displayViewFeature
          ? (
            <div className="table__cell-popover">
              <CellTarget />
            </div>
          )
          : (
            <Popover
              className="table__cell-popover"
              popoverClassName={`${Classes.POPOVER_CONTENT_SIZING} ${Classes.POPOVER_DISMISS}`}
              interactionKind={PopoverInteractionKind.CLICK}
              position={Position.TOP}
              isOpen={isOpen}
              content={
            displayUpdateFeature ? (
              <Trans
                i18nKey="CRUD.table.readOrUpdateMessage"
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
              <CellTarget />
            </Popover>
          )}
      </div>
    );
  }
}

export default CellRender;
