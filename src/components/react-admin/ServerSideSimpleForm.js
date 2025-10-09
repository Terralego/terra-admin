import React from 'react';
import { SimpleForm } from 'react-admin';
import useSaveWithErrorHandling from '../../hooks/useSaveWithErrorHandling';

function ServerSideSimpleForm ({ children, record, resource, ...props }) {
  const save = useSaveWithErrorHandling(record.id !== undefined, resource);

  return (
    <SimpleForm {...props} record={record} resource={resource} save={save}>
      {children}
    </SimpleForm>
  );
}

export default ServerSideSimpleForm;
