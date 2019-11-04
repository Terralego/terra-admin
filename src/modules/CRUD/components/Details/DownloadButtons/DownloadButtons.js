import React from 'react';
import PropTypes from 'prop-types';
import { Menu, MenuItem, Popover, Classes, Button, Position } from '@blueprintjs/core';

const DownloadButtons = ({ documents, t }) => documents.length > 0 && (
  <Popover
    position={Position.BOTTOM_RIGHT}
    content={(
      <Menu>
        {documents.map(({ download_url: url, template_file: file, template_name: name }) => (
          <MenuItem
            className={Classes.MINIMAL}
            icon="document"
            text={name}
            key={file}
            href={url}
          />
        ))}
      </Menu>
  )}
  >
    <Button icon="download" text={t('CRUD.details.generatedDocuments')} />
  </Popover>
);

DownloadButtons.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      template_name: PropTypes.string,
      download_url: PropTypes.string,
      template_file: PropTypes.string,
    }),
  ),
  t: PropTypes.func,
};

DownloadButtons.defaultProps = {
  documents: [],
  t: text => text,
};

export default DownloadButtons;
