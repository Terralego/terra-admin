import React from 'react';
import PropTypes from 'prop-types';
import { parseUrl } from 'query-string';
import NoValue from '../../NoValue';

const getFileName = src => {
  const { url } = parseUrl(src);
  return decodeURIComponent(url.split('/').pop());
};

const FileType = props => {
  const {
    display_value: displayValue,
    schema: {
      title,
    },
    type,
  } = props;
  const { url } = displayValue;
  if (!url) {
    return <NoValue />;
  }
  return (
    <>
      {url.map((src => {
        const text = getFileName(src) || title;
        return (
          (type === 'image')
            ? <img key={src} src={src} alt={text} />
            : (
              <a
                key={src}
                href={src}
                rel="download noopener noreferrer"
                target="_blank"
              >
                {text}
              </a>
            )
        );
      }))}
    </>
  );
};

FileType.propTypes = {
  display_value: PropTypes.shape({
    thumbnail: PropTypes.string,
    url: PropTypes.arrayOf(PropTypes.string),
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
