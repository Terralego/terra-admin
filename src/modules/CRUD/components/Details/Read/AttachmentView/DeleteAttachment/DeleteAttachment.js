import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Classes, H5, Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { deleteAttachment } from '../../../../../services/attachments';

const DeleteAttachment = ({
  endpoint,
  id,
  label,
  loading,
  setDeleting,
  t,
  updateData,
}) => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleDelete = useCallback(async () => {
    setDeleting(id);
    await deleteAttachment(endpoint);
    if (!isMounted.current) return;
    updateData();
  }, [endpoint, id, setDeleting, updateData]);

  return (
    <Popover
      className="attachment-item__delete"
      disabled={loading}
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      interactionKind={PopoverInteractionKind.CLICK}
      content={(
        <div className="details__confirm">
          <H5>{t('CRUD.details.confirmDeletion')}</H5>
          {/* eslint-disable-next-line react/no-danger */}
          <p dangerouslySetInnerHTML={{ __html: t('CRUD.details.attachment.confirmDeletionText', { name: `<strong>${label}</strong>` }) }} />
          <div className="details__confirm-content">
            <Button
              className={Classes.POPOVER_DISMISS}
              text={t('CRUD.details.cancel')}
            />
            <Button
              className={Classes.POPOVER_DISMISS}
              intent="danger"
              onClick={handleDelete}
              text={t('CRUD.details.delete')}
            />
          </div>
        </div>
      )}
    >
      <Button disabled={loading} className="attachment-item__bt-delete" icon="small-cross" minimal title={t('CRUD.details.attachment.delete')} />
    </Popover>
  );
};

DeleteAttachment.propTypes = {
  endpoint: PropTypes.string,
  id: PropTypes.number,
  label: PropTypes.string,
  loading: PropTypes.bool,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
  updateData: PropTypes.func,
};

DeleteAttachment.defaultProps = {
  endpoint: undefined,
  id: null,
  label: '',
  loading: false,
  match: {
    params: {
      id: undefined,
    },
  },
  t: () => {},
  updateData: () => {},
};

export default DeleteAttachment;
