import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, InputGroup, Intent } from '@blueprintjs/core';
import { saveAttachment } from '../../../../../services/attachments';

const Figcaption = ({
  category,
  editable,
  endpoint,
  label,
  updateData,
  t,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const handleSubmit = useCallback(async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nextLabel = formData.get('label');
    if (label === nextLabel) {
      setEditing(false);
      return;
    }

    setLoading(true);
    const nextAttachment = await saveAttachment(endpoint, { legend: nextLabel, category }, 'PATCH');

    if (nextAttachment.id) {
      await updateData();
    }
    if (!isMounted.current) return;
    setLoading(false);
    setEditing(false);
  }, [category, endpoint, label, updateData]);

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="attachment-item__figcaption">
        <InputGroup name="label" required defaultValue={label} />
        <Button
          icon="tick"
          intent={Intent.PRIMARY}
          minimal
          title={t('CRUD.details.attachment.figcaptionSubmit')}
          type="submit"
          loading={isLoading}
        />
        <Button
          icon="undo"
          minimal
          onClick={() => setEditing(false)}
          title={t('CRUD.details.attachment.figcaptionCancel')}
          disabled={isLoading}
        />
      </form>
    );
  }

  return (
    <figcaption className="attachment-item__figcaption">
      <span className="attachment-item__figcaption-text">{label}</span>
      {editable && endpoint && (
        <Button
          className="attachment-item__figcaption-edit"
          icon="edit"
          minimal
          onClick={() => setEditing(true)}
          title={t('CRUD.details.attachment.figcaptionEdit')}
        />
      )}
    </figcaption>
  );
};

Figcaption.propTypes = {
  category: PropTypes.number,
  editable: PropTypes.bool,
  endpoint: PropTypes.string,
  label: PropTypes.string,
  t: PropTypes.func,
  updateData: PropTypes.func,
};

Figcaption.defaultProps = {
  category: undefined,
  editable: false,
  endpoint: undefined,
  label: '',
  t: () => {},
  updateData: () => {},
};

export default Figcaption;
