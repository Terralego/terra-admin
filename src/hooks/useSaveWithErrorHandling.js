import { useMutation, useNotify, useRedirect } from 'ra-core';
import { useCallback } from 'react';

/**
 * Convert the django error response to an object react-admin understands
 *
 * See https://marmelab.com/react-admin/doc/3.19/CreateEdit.html#server-side-validation
 */
function useSaveWithErrorHandling (edit, resource) {
  const [mutate] = useMutation();
  const notify = useNotify();
  const redirect = useRedirect();

  const save = useCallback(
    async values => {
      try {
        await mutate({
          type: edit ? 'update' : 'create',
          resource,
          payload: { id: values.id, data: values },
        }, { returnPromise: true });
        redirect(`/${resource}`);
      } catch (error) {
        const errorData = error.body ?? error.data;
        if (error.status === 400 && errorData) {
          const errorObject = { ...errorData };
          Object.entries(errorObject).forEach(([key, value]) => {
            errorObject[key] = value.reduce((acc, current) => `${acc} ${current}`);
          });
          notify('ra.message.invalid_form', { type: 'error' });
          return errorObject;
        }
      }
      return null;
    },
    [mutate, edit, resource, notify, redirect],
  );
  return save;
}

export default useSaveWithErrorHandling;
