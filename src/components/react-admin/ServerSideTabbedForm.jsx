import React from 'react';
import { TabbedForm } from 'react-admin';
import useSaveWithErrorHandling from '../../hooks/useSaveWithErrorHandling';

function ServerSideTabbedForm ({ children, record, resource, ...props }) {
  const save = useSaveWithErrorHandling(record.id !== undefined, resource);

  return (
    <TabbedForm {...props} record={record} resource={resource} save={save}>
      {children}
    </TabbedForm>
  );
}

export default ServerSideTabbedForm;
