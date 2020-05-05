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
  editable,
  fetchFeature,
  name,
  onSelection,
  selectable,
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
      editable,
      endpoint,
      label,
      name,
      isLoading: rest.id === isDeleting,
      setDeleting,
      updateData,
      ...rest,
    }))
  ), [attachments, editable, isDeleting, name, updateData]);

  return (
    <ul className={classnames('attachment-list', className)} {...props}>
      {sanitizeAttachments.map(attachmentProps => {
        const { id } = attachmentProps;
        const wrapperProps = { className: 'attachment-list__item', key: id };
        if (!selectable) {
          return <AttachmentItem {...wrapperProps} {...attachmentProps} />;
        }
        return (
          <li {...wrapperProps}>
            <label htmlFor={`attachment-${id}`}>
              <input name="attachment" type="radio" id={`attachment-${id}`} onClick={() => onSelection(attachmentProps.image || attachmentProps.file)} />
              <AttachmentItem component="div" {...attachmentProps} />
            </label>
          </li>
        );
      })}
    </ul>
  );
};

AttachmentList.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape({})),
  className: PropTypes.string,
  editable: PropTypes.bool,
  fetchFeature: PropTypes.func,
  name: PropTypes.oneOf(['attachments', 'pictures']),
  onSelection: PropTypes.func,
  selectable: PropTypes.bool,
  settings: PropTypes.shape({}),
};

AttachmentList.defaultProps = {
  attachments: [],
  className: '',
  editable: false,
  fetchFeature: () => {},
  name: 'attachments',
  onSelection: () => {},
  selectable: false,
  settings: {},
};

export default AttachmentList;
