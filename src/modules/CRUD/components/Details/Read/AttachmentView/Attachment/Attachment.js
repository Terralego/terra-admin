import React from 'react';
import PropTypes from 'prop-types';

const Attachment = ({ file, label, ...props }) => {
  if (!file) {
    return null;
  }
  return (
    <div {...props}>
      <a rel="noopener noreferrer download" target="_blank" href={file}>{label}</a>
    </div>
  );
};

Attachment.propTypes = {
  file: PropTypes.string,
  label: PropTypes.string,
};

Attachment.defaultProps = {
  file: undefined,
  label: undefined,
};

export default Attachment;
