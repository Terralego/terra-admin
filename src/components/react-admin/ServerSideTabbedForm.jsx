import React from 'react';
import { TabbedForm } from 'react-admin';
import useSaveWithErrorHandling from '../../hooks/useSaveWithErrorHandling';

function ServerSideTabbedForm ({ children, record, resource, transform, ...props }) {
  const save = useSaveWithErrorHandling(record?.id !== undefined, resource);

  const handleSave = React.useCallback(
    async values => save(transform ? await transform(values) : values),
    [save, transform],
  );

  return (
    <TabbedForm {...props} record={record} resource={resource} save={handleSave}>
      {children}
    </TabbedForm>
  );
}

export default ServerSideTabbedForm;
