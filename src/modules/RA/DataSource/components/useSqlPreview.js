import React from 'react';
import { useRecordContext } from 'react-admin';
import Api from '../../../../terra-front/Api';

const useSqlPreview = () => {
  const record = useRecordContext();
  const recordId = record?.id;
  const updatedAt = record?.updated_at;

  const [preview, setPreview] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!recordId) return undefined;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Api.request(`geosource/${recordId}/file-preview/`)
      .then(resp => { if (!cancelled) setPreview(resp); })
      .catch(err => { if (!cancelled) setError(err?.message || String(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [recordId, updatedAt]);

  return {
    preview,
    loading,
    error,
    bbox: preview?.bbox,
    isEditMode: !!recordId,
  };
};

export default useSqlPreview;
