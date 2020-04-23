import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Loading from '../../../../../../../components/Loading';

import Attachment from '../Attachment';
import Picture from '../Picture';
import Figcaption from '../Figcaption';
import DeleteAttachment from '../DeleteAttachment';

import './styles.scss';

const AttachmentList = ({
  attachments,
  className,
  featureEndpoint,
  fetchFeature,
  history,
  location,
  match: { params: { id: paramId } },
  name,
  staticContext,
  ...props
}) => {
  const [isDeleting, setDeleting] = useState(null);

  const updateData = useCallback(async () => {
    fetchFeature(featureEndpoint, paramId);
  }, [featureEndpoint, fetchFeature, paramId]);

  const Component = name === 'attachments' ? Attachment : Picture;
  return (
    <ul className={classnames('attachment-list', className)} {...props}>
      {attachments.map(({
        action_url: endpoint,
        category,
        id,
        file,
        legend: label,
        thumbnail,
      }) => {
        const isLoading = id === isDeleting;
        return (
          <li
            className={classnames({
              'attachment-list__item': true,
              'attachment-item': true,
              'attachment-item--loading': isLoading,
            })}
            key={id}
          >
            {isLoading && <Loading className="attachment-item__Loading" spinner />}
            <figure className="attachment-item__figure">
              <Component
                className="attachment-item__file"
                file={file}
                label={label}
                thumbnail={thumbnail}
              />
              <Figcaption
                category={category}
                endpoint={endpoint}
                label={label}
                updateData={updateData}
              />
            </figure>
            <DeleteAttachment
              endpoint={endpoint}
              id={id}
              label={label}
              loading={isLoading}
              setDeleting={setDeleting}
              updateData={updateData}
            />
          </li>
        );
      })}
    </ul>
  );
};

AttachmentList.propTypes = {
  attachments: PropTypes.arrayOf(PropTypes.shape({})),
  className: PropTypes.string,
  name: PropTypes.oneOf(['attachments', 'pictures']),
};

AttachmentList.defaultProps = {
  attachments: [],
  className: '',
  name: 'attachments',
};

export default AttachmentList;
