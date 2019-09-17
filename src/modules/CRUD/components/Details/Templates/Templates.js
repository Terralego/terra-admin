import React from 'react';
import PropTypes from 'prop-types';
import { AnchorButton, ButtonGroup } from '@blueprintjs/core';

const Templates = ({ files, id }) => id && files.length && (
  <ButtonGroup>
    {files.map(({ name, url }) => (
      <AnchorButton key={url} icon="download" href={url.replace('{id}', id)}>{name}</AnchorButton>
    ))}
  </ButtonGroup>
);

Templates.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  id: PropTypes.number,
};

Templates.defaultProps = {
  files: [],
  id: '',
};

export default Templates;
