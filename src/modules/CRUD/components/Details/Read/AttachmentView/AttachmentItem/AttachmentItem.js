import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Loading from '../../../../../../../components/Loading';
import Attachment from '../Attachment';
import Picture from '../Picture';
import Figcaption from '../Figcaption';
import DeleteAttachment from '../DeleteAttachment';

const AttachmentItem = ({
  category,
  component: Component,
  editable,
  endpoint,
  className,
  id,
  image,
  isLoading,
  file,
  label,
  name,
  setDeleting,
  thumbnail,
  updateData,
}) => {
  const AttachmentType = name === 'attachments' ? Attachment : Picture;

  return (
    <Component
      className={classnames({
        'attachment-item': true,
        'attachment-item--loading': isLoading,
      }, className)}
    >
      {isLoading && <Loading className="attachment-item__Loading" spinner />}
      <figure className="attachment-item__figure">
        <AttachmentType
          className="attachment-item__file"
          file={file}
          image={image}
          label={label}
          thumbnail={thumbnail}
        />
        <Figcaption
          category={category}
          editable={editable}
          endpoint={endpoint}
          label={label}
          updateData={updateData}
        />
      </figure>
      {editable && (
        <DeleteAttachment
          endpoint={endpoint}
          id={id}
          label={label}
          loading={isLoading}
          setDeleting={setDeleting}
          updateData={updateData}
        />
      )}
    </Component>
  );
};

AttachmentItem.propTypes = {
  category: PropTypes.number,
  component: PropTypes.string,
  editable: PropTypes.bool,
  endpoint: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.number,
  isLoading: PropTypes.bool,
  file: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.oneOf(['attachments', 'pictures']),
  setDeleting: PropTypes.func,
  thumbnail: PropTypes.string,
  updateData: PropTypes.func,
};

AttachmentItem.defaultProps = {
  editable: false,
  endpoint: undefined,
  category: null,
  component: 'li',
  className: '',
  id: null,
  isLoading: false,
  file: undefined,
  label: '',
  name: 'attachments',
  setDeleting: () => {},
  thumbnail: undefined,
  updateData: () => {},
};

export default AttachmentItem;
