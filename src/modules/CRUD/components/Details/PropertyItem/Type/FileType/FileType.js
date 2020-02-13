import React from 'react';
import PropTypes from 'prop-types';
import NoValue from '../../NoValue';

const FileType = ({
  display_value: displayValue,
  schema: {
    title,
  },
  t,
  type,
}) => {
  const { url } = displayValue;
  if (!url) {
    return <NoValue t={t} />;
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
  t: PropTypes.func,
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
  t: text => text,
  type: 'file',
};

export default FileType;
