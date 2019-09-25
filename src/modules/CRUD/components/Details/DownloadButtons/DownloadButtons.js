import React from 'react';
import PropTypes from 'prop-types';
import { AnchorButton, ButtonGroup } from '@blueprintjs/core';

const DownloadButtons = ({ files, id, ...rest }) => id && files.length > 0 && (
  <ButtonGroup {...rest}>
    {files.map(({ name, url }) => (
      <AnchorButton key={url} icon="download" href={url.replace('{id}', id)}>{name}</AnchorButton>
    ))}
  </ButtonGroup>
);

DownloadButtons.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  id: PropTypes.number,
};

DownloadButtons.defaultProps = {
  files: [],
  id: '',
};

export default DownloadButtons;
