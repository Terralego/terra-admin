import React from 'react';
import { Edit } from 'react-admin';

import BaseLayerForm from '../components/BaseLayerForm';
import EditAside from '../components/EditAside';
import FormActions from '../components/FormActions';
import usePreview from '../components/usePreview';
import useStackedAside from '../../../../components/react-admin/useStackedAside';
import RecordTitle from '../../../../components/react-admin/RecordTitle';

export const BaseLayerEdit = props => {
  const { values, onValuesChange, open, toggle } = usePreview();
  const stacked = useStackedAside();

  return (
    <Edit
      classes={stacked}
      title={<RecordTitle />}
      mutationMode="pessimistic"
      {...props}
      actions={<FormActions previewOpen={open} onTogglePreview={toggle} />}
      aside={open ? <EditAside values={values} /> : undefined}
    >
      <BaseLayerForm onValuesChange={onValuesChange} />
    </Edit>
  );
};

export default BaseLayerEdit;
