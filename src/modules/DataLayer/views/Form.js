import React from 'react';
import {
  Create,
  Edit,
} from 'react-admin';

import DataLayerTabbedForm from '../components/DataLayerTabbedForm';

export const DataLayerForm = (FormMode = Create) => props => (
  <FormMode
    {...(FormMode === Edit ? { undoable: false } : {})}
    {...props}
  >
    <DataLayerTabbedForm />
  </FormMode>
);

export const DataLayerCreate = DataLayerForm(Create);
export const DataLayerEdit = DataLayerForm(Edit);

export default {
  DataLayerCreate,
  DataLayerEdit,
};
