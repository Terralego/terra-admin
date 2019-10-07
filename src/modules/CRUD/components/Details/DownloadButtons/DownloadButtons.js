import React from 'react';
import PropTypes from 'prop-types';
import { AnchorButton, ButtonGroup } from '@blueprintjs/core';

const DownloadButtons = ({ documents, ...rest }) => documents.length > 0 && (
  <ButtonGroup {...rest}>
    {documents.map(({ download_url: url, template_file: file, template_name: name }) => (
      <AnchorButton key={file} icon="download" href={url}>{name}</AnchorButton>
    ))}
  </ButtonGroup>
);

DownloadButtons.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      template_name: PropTypes.string,
      download_url: PropTypes.string,
      template_file: PropTypes.string,
    }),
  ),
};

DownloadButtons.defaultProps = {
  documents: [],
};

export default DownloadButtons;
