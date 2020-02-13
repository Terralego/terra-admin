import React from 'react';
import PropTypes from 'prop-types';
import NoValue from '../../NoValue';

const FileType = ({
  display_value: displayValue,
  schema: {
    title,
  },
  type,
}) => {
  const { url } = displayValue;
  if (!url) {
    return <NoValue />;
  }
  if (type === 'image') {
    return <img src={url} alt={title} />;
  }
  return (
    <a
      href={url}
      rel="download noopener noreferrer"
      target="_blank"
    >
      {title}
    </a>
  );
};

FileType.propTypes = {
  display_value: PropTypes.shape({
    thumbnail: PropTypes.string,
    url: PropTypes.string,
  }),
  schema: PropTypes.shape({
    title: PropTypes.string,
  }),
  type: PropTypes.string,
};

FileType.defaultProps = {
  display_value: {
    thumbnail: undefined,
    url: undefined,
  },
  schema: {
    title: '',
  },
  type: 'file',
};

export default FileType;
