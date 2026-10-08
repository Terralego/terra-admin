import React, { useEffect, useRef, useState } from 'react';

import Api from '../../../../terra-front/Api';
import { IconButton, Tooltip } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import DoneIcon from '@material-ui/icons/Done';
import { useNotify, useTranslate } from 'react-admin';

const DownloadSourceFileButton = ({ recordId, filename, ...props }) => {
  const translate = useTranslate();
  const notify = useNotify();
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleDownload = async () => {
    if (!recordId || downloading) return;
    setDownloading(true);
    try {
      const blob = await Api.request(`geosource/${recordId}/download/`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      timeoutRef.current = setTimeout(() => setDownloaded(false), 3000);
    } catch (e) {
      notify('datasource.form.file.downloadError', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const label = translate(
    downloaded ? 'datasource.form.file.downloaded' : 'datasource.form.file.download',
  );

  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        color="primary"
        onClick={handleDownload}
        disabled={downloading}
        aria-label={label}
        {...props}
      >
        {downloaded ? <DoneIcon /> : <GetAppIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default DownloadSourceFileButton;
