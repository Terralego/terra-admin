import React from 'react';
import { Create } from 'react-admin';

import DataLayerForm from '../components/DataLayerForm';
import DataLayerActions from '../components/DataLayerActions';
import MinisheetPreviewAside from '../components/tabs/MinisheetTab/MinisheetPreviewAside';
import useMinisheetPreview, { MinisheetPreviewProvider } from '../components/tabs/MinisheetTab/useMinisheetPreview';
import useStackedAside from '../../../../components/react-admin/useStackedAside';

export const DataLayerCreate = props => {
  const { preview, publish, open, toggle, available } = useMinisheetPreview();
  const stacked = useStackedAside();

  return (
    <MinisheetPreviewProvider value={publish}>
      <Create
        classes={stacked}
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
        <DataLayerForm />
      </Create>
    </MinisheetPreviewProvider>
  );
};

export default DataLayerCreate;
