import React from 'react';
import { Edit, Loading, useEditController } from 'react-admin';

import DataSourceFormSelector from '../components/DataSourceFormSelector';
import DataSourceEditActions from '../components/DataSourceEditActions';
import PreviewAside from '../components/PreviewAside';
import usePreviewAside, { PreviewProvider } from '../components/usePreviewAside';
import PreventPartialData from '../../../../components/react-admin/PreventPartialData';
import RecordTitle from '../../../../components/react-admin/RecordTitle';
import useStackedAside from '../../../../components/react-admin/useStackedAside';


const EditDataSourceFormSelector = PreventPartialData('description', DataSourceFormSelector);

export const DataSourceEdit = props => {
  const { loaded } = useEditController(props);
  const { preview, publish, open, toggle, available } = usePreviewAside();
  const stacked = useStackedAside();

  if (!loaded) {
    return <Loading />;
  }

  return (
    <PreviewProvider value={publish}>
      <Edit
        classes={stacked}
        title={<RecordTitle />}
        mutationMode="pessimistic"
        actions={(
          <DataSourceEditActions
            {...props}
            previewAvailable={available}
            previewOpen={open}
            onTogglePreview={toggle}
          />
        )}
        aside={available && open ? <PreviewAside preview={preview} /> : undefined}
        {...props}
      >
        <EditDataSourceFormSelector />
      </Edit>
    </PreviewProvider>
  );
};

export default DataSourceEdit;
