import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Classes, MenuDivider, MenuItem } from '@blueprintjs/core';

const ExportGeneratedFiles = ({ files }) => {
  const { t } = useTranslation();

  const count = files.length;

  if (!count) {
    return null;
  }

  return (
    <>
      <MenuDivider title={t('CRUD.details.generatedDocument', { count })} />
      {files.map(({ download_url: url, template_file: file, template_name: name }) => (
        <MenuItem
          className={Classes.MINIMAL}
          icon="document"
          text={name}
          key={file}
          href={url}
        />
      ))}
    </>
  );
};

ExportGeneratedFiles.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      template_name: PropTypes.string,
      download_url: PropTypes.string,
      template_file: PropTypes.string,
    }),
  ),
};

ExportGeneratedFiles.defaultProps = {
  files: [],
};

export default ExportGeneratedFiles;
