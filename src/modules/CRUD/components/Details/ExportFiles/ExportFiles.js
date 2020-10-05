import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Menu, Popover, Button, Position } from '@blueprintjs/core';
import ExportGeneratedFiles from '../ExportGeneratedFiles';

const ExportFiles = ({ generatedFiles, geomFiles }) => {
  const { t } = useTranslation();
  if (!generatedFiles && !geomFiles) {
    return null;
  }
  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={(
        <Menu>
          <ExportGeneratedFiles files={generatedFiles} />
        </Menu>
      )}
    >
      <Button icon="download" minimal text={t('CRUD.details.exportFiles')} />
    </Popover>
  );
};

ExportFiles.propTypes = {
  generatedFiles: PropTypes.arrayOf(
    PropTypes.shape({
      template_name: PropTypes.string,
      download_url: PropTypes.string,
      template_file: PropTypes.string,
    }),
  ),
  geomFiles: PropTypes.shape({}),
};

ExportFiles.defaultProps = {
  generatedFiles: undefined,
  geomFiles: undefined,
};

export default ExportFiles;
