import React from 'react';
import { Edit } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DataLayerActions from '../components/DataLayerActions';
import MinisheetPreviewAside from '../components/tabs/MinisheetTab/MinisheetPreviewAside';
import useMinisheetPreview, { MinisheetPreviewProvider } from '../components/tabs/MinisheetTab/useMinisheetPreview';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';
import RecordTitle from '../../../../components/react-admin/RecordTitle';
import useStackedAside from '../../../../components/react-admin/useStackedAside';

const EditDataLayerForm = PreventPartialData('description', DataLayerForm);

export const DataLayerEdit = props => {
  const { preview, publish, open, toggle, available } = useMinisheetPreview();
  const stacked = useStackedAside();

  return (
    <MinisheetPreviewProvider value={publish}>
      <Edit
        classes={stacked}
        title={<RecordTitle />}
        mutationMode="pessimistic"
        {...props}
        actions={(
          <DataLayerActions
            previewAvailable={available}
            previewOpen={open}
            onTogglePreview={toggle}
          />
        )}
        aside={available && open ? <MinisheetPreviewAside preview={preview} /> : undefined}
      >
        <EditDataLayerForm />
      </Edit>
    </MinisheetPreviewProvider>
  );
};

export default DataLayerEdit;
