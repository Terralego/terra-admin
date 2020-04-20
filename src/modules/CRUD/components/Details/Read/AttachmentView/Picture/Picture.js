import React from 'react';
import PropTypes from 'prop-types';

const Picture = ({ label, thumbnail, ...props }) => {
  if (!thumbnail) {
    return null;
  }
  return (
    <div {...props}>
      <img src={thumbnail} alt={label} />
    </div>
  );
};

Picture.propTypes = {
  label: PropTypes.string,
  thumbnail: PropTypes.string,
};

Picture.defaultProps = {
  label: undefined,
  thumbnail: undefined,
};

export default Picture;
