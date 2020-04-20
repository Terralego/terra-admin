import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Attachment from '../Attachment';
import Picture from '../Picture';

import './styles.scss';

const AttachmentList = ({
  name,
  attachments,
  className,
  ...props
}) => {
  const Component = name === 'attachments' ? Attachment : Picture;
  return (
    <ul className={classNames('attachment-list', className)} {...props}>
      {attachments.map(({ id, file, legend: label, thumbnail }) => (
        <li className="attachment-list__item attachment-item" key={id}>
          <figure className="attachment-item__figure">
            <Component
              className="attachment-item__file"
              file={file}
              label={label}
              thumbnail={thumbnail}
            />
            <figcaption className="attachment-item__figcaption">
              <span className="attachment-item__figcaption-text">{label}</span>
            </figcaption>
          </figure>
        </li>
      ))}
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
