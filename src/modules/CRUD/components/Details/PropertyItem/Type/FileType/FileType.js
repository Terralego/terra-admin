import React from 'react';
import PropTypes from 'prop-types';
import { parseUrl } from 'query-string';
import NoValue from '../../NoValue';

const getFileName = src => {
  const { url } = parseUrl(src);
  return decodeURIComponent(url.split('/').pop());
};

const FileType = ({
  display_value: { url, thumbnail },
  schema: { title },
  type,
}) => {
  if (!url) {
    return <NoValue />;
  }

  const text = getFileName(url) || title;

  if (type === 'image') {
    return <img key={thumbnail} src={thumbnail} alt={text} />;
  }

  return (
    <a
      key={url}
      href={url}
      rel="download noopener noreferrer"
      target="_blank"
    >
      {text}
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
