import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Menu, Popover, Position } from '@blueprintjs/core';

import { CRUDContext } from '../../services/CRUDProvider';
import { getView } from '../../services/CRUD';
import ExportGeomLink from './ExportGeomLink';

const ExportGeom = () => {
  const [open, setOpen] = useState(false);
  const { layer } = useParams();
  const { settings } = useContext(CRUDContext);
  const { t } = useTranslation();

  const handleClose = () => setOpen(false);

  const { exports } = useMemo(() => (
    getView(settings, layer)
  ), [layer, settings]);

  if (!exports) {
    return null;
  }

  return (
    <div PopoverInteractionKind>
      <Popover
        position={Position.TOP}
        boundary="window"
        isOpen={open}
        content={(
          <Menu>
            {Object.entries(exports).map(([name, url]) => (
              <ExportGeomLink
                key={name}
                name={name}
                url={url}
                onValidation={handleClose}
              />
            ))}
          </Menu>
      )}
      >
        <Button
          icon="download"
          minimal
          onClick={() => setOpen(prevOpen => !prevOpen)}
          text={t('CRUD.export.label')}
        />
      </Popover>
    </div>
  );
};

export default ExportGeom;
