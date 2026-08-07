import React from 'react';
import { SimpleForm } from 'react-admin';
import useSaveWithErrorHandling from '../../hooks/useSaveWithErrorHandling';

function ServerSideSimpleForm ({ children, record, resource, transform, ...props }) {
  const save = useSaveWithErrorHandling(record.id !== undefined, resource);

  const handleSave = React.useCallback(
    async values => save(transform ? await transform(values) : values),
    [save, transform],
  );

  return (
    <SimpleForm {...props} record={record} resource={resource} save={handleSave}>
      {children}
    </SimpleForm>
  );
}

export default ServerSideSimpleForm;
