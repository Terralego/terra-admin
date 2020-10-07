import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Classes, MenuDivider, MenuItem } from '@blueprintjs/core';

import { exportFileFromURL } from '../../../services/utils';

const File = ({ name, href }) => {
  const handleClick = useCallback(async event => {
    event.preventDefault();
    exportFileFromURL(href);
  }, [href]);

  return (
    <MenuItem
      className={Classes.MINIMAL}
      icon="document"
      text={name}
      href={href}
      onClick={handleClick}
    />
  );
};


const ExportGeomFiles = ({ files }) => {
  const list = Object.entries(files);
  const { t } = useTranslation();

  const count = list.length;

  if (!count) {
    return null;
  }

  return (
    <>
      <MenuDivider title={t('CRUD.details.generatedGeomFile', { count })} />
      {list.map(([name, href]) => (
        <File
          href={href}
          key={name}
          name={name}
        />
      ))}
    </>
  );
};

ExportGeomFiles.propTypes = {
  geomFiles: PropTypes.shape({}),
};

ExportGeomFiles.defaultProps = {
  geomFiles: {},
};

export default ExportGeomFiles;
