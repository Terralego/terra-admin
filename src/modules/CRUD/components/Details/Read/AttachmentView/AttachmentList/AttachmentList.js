import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import classnames from 'classnames';
import { getView } from '../../../../../services/CRUD';

import AttachmentItem from '../AttachmentItem';

import './styles.scss';

const AttachmentList = ({
  attachments,
  className,
  fetchFeature,
  name,
  settings,
  ...props
}) => {
  const [isDeleting, setDeleting] = useState(null);
  const { id: paramId, layer: paramLayer } = useParams();

  const updateData = useCallback(async () => {
    const { featureEndpoint } = getView(settings, paramLayer);
    await fetchFeature(featureEndpoint, paramId);
  }, [fetchFeature, paramId, paramLayer, settings]);

  const sanitizeAttachments = useMemo(() => (
    attachments.map(({
      action_url: endpoint,
      legend: label,
      created_at: createdAt,
      updated_at: updatedAt,
      ...rest
    }) => ({
      endpoint,
      label,
      name,
      isLoading: rest.id === isDeleting,
      key: rest.id,
      setDeleting,
      updateData,
      ...rest,
    }))
  ), [attachments, isDeleting, name, updateData]);

  return (
    <ul className={classnames('attachment-list', className)} {...props}>
      {sanitizeAttachments.map(attachmentProps => (
        <AttachmentItem className="attachment-list__item" {...attachmentProps} />
      ))}
    </ul>
  );
};

AttachmentList.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape({})),
  className: PropTypes.string,
  fetchFeature: PropTypes.func,
  name: PropTypes.oneOf(['attachments', 'pictures']),
  settings: PropTypes.shape({}),
};

AttachmentList.defaultProps = {
  attachments: [],
  className: '',
  fetchFeature: () => {},
  name: 'attachments',
  settings: {},
};

export default AttachmentList;
