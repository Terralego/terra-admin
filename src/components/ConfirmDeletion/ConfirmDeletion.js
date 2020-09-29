import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, H5, PopoverInteractionKind, Classes, Tooltip } from '@blueprintjs/core';

const ConfirmDeletion = ({
  t,
  cancelText = t('common.cancel'),
  children,
  confirmationText,
  onCancel,
  onDelete,
  submitText = t('common.delete'),
  titleText = t('common.confirmDeletion'),
  ...props
}) => (
  <Popover
    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
    interactionKind={PopoverInteractionKind.CLICK}
    content={(
      <div className="details__confirm">
        <H5>{titleText}</H5>
        {/* eslint-disable-next-line react/no-danger */}
        {confirmationText && <p dangerouslySetInnerHTML={{ __html: confirmationText }} />}
        <div className="details__confirm-content">
          <Button
            className={Classes.POPOVER_DISMISS}
            onClick={onCancel}
            text={cancelText}
          />
          <Button
            className={Classes.POPOVER_DISMISS}
            intent="danger"
            onClick={onDelete}
            text={submitText}
          />
        </div>
      </div>
      )}
    {...props}
  >
    {children || (
      <Tooltip
        content={submitText}
      >
        <Button
          className="details__delete-feature"
          icon="trash"
          intent="danger"
          minimal
        />
      </Tooltip>
    )}
  </Popover>
);


ConfirmDeletion.propTypes = {
  cancelText: PropTypes.string,
  children: PropTypes.node,
  confirmationText: PropTypes.string,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func,
  submitText: PropTypes.string,
  t: PropTypes.func,
  titleText: PropTypes.string,
};

ConfirmDeletion.defaultProps = {
  cancelText: undefined,
  children: null,
  confirmationText: undefined,
  onCancel: () => {},
  onDelete: () => {},
  submitText: undefined,
  t: text => text,
  titleText: undefined,
};

export default ConfirmDeletion;
