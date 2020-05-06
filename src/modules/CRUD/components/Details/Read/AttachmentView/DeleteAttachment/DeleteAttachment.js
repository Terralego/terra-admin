import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { deleteAttachment } from '../../../../../services/attachments';
import ConfirmDeletion from '../../../../../../../components/ConfirmDeletion';

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
    <ConfirmDeletion
      className="attachment-item__delete"
      confirmationText={t('CRUD.details.confirmDeletionText', { name: `<strong>${label}</strong>` })}
      disabled={loading}
      onDelete={handleDelete}
    >
      <Button disabled={loading} className="attachment-item__bt-delete" icon="small-cross" minimal title={t('CRUD.details.attachment.delete')} />
    </ConfirmDeletion>
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
