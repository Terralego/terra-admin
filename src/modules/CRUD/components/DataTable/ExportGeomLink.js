import React, { useCallback, useState } from 'react';
import { Callout, Card, Classes, Button, H5, Intent, MenuItem, Overlay } from '@blueprintjs/core';
import Api from '@terralego/core/modules/Api';
import { useTranslation } from 'react-i18next';
import { sanitizeCustomEndpoint } from '../../services/utils';

const ExportGeomLink = ({ name, onValidation, url }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('request'); // request, success, error

  const handleClose = useCallback(() => {
    setOpen(false);
    onValidation();
  }, [onValidation]);

  const handleRequest = useCallback(async event => {
    event.preventDefault();
    const result = {};
    try {
      const request = await Api.request(`${sanitizeCustomEndpoint(url)}`);
      result.request = request;
    } catch (e) {
      result.error = e;
    }

    if (result.error) {
      setAction('error');
      return;
    }
    setAction('success');
  }, [url]);

  const messages = {
    request: {
      content: t('CRUD.export.request', { name }),
      submit: t('CRUD.export.generate'),
    },
    success: {
      content: t('CRUD.export.success', { name }),
      submit: t('common.close'),
    },
    error: {
      content: t('CRUD.export.error', { name }),
      submit: t('common.close'),
    },
  };

  return (
    <>
      <MenuItem
        className={Classes.MINIMAL}
        icon="document"
        text={name}
        onClick={() => setOpen(true)}
      />
      <Overlay
        className={`${Classes.OVERLAY_SCROLL_CONTAINER} importGeomFileOverlay`}
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <Card>
          <H5>{t('CRUD.export.title', { name })}</H5>
          <Callout intent={action}>{messages[action].content}</Callout>
          <div className="importGeomFileOverlay__actions">
            <Button minimal onClick={handleClose}>{t('common.cancel')}</Button>
            <Button
              icon={action === 'request' ? 'download' : 'cross'}
              intent={Intent.PRIMARY}
              onClick={action === 'request' ? handleRequest : handleClose}
            >
              {messages[action].submit}
            </Button>
          </div>
        </Card>
      </Overlay>
    </>
  );
};

export default ExportGeomLink;
