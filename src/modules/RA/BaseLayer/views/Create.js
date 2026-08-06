import React from 'react';
import { Create } from 'react-admin';

import BaseLayerForm from '../components/BaseLayerForm';
import EditAside from '../components/EditAside';
import FormActions from '../components/FormActions';
import usePreview from '../components/usePreview';
import useStackedAside from '../../../../components/react-admin/useStackedAside';

export const BaseLayerCreate = props => {
  const { values, onValuesChange, open, toggle } = usePreview();
  const stacked = useStackedAside();

  return (
    <Create
      classes={stacked}
      {...props}
      actions={<FormActions previewOpen={open} onTogglePreview={toggle} />}
      aside={open ? <EditAside values={values} /> : undefined}
    >
      <BaseLayerForm onValuesChange={onValuesChange} />
    </Create>
  );
};

export default BaseLayerCreate;
