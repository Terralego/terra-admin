import React from 'react';
import {
  Create,
  SimpleForm,
  FormDataConsumer,
} from 'react-admin';

import DataSourceMainFields from '../components/DataSourceMainFields';
import DataSourceFileFields from '../components/DataSourceFileFields';
import DataSourceDbFields from '../components/DataSourceDbFields';
import DataSourceWMTSField from '../components/DataSourceWMTSField';
import DataSourceCSVFields from '../components/DataSourceCSVFields';
import DataSourceTypeInput from '../components/DataSourceTypeInput';
import CreateActions from '../components/CreateActions';
import PreviewAside from '../components/PreviewAside';
import usePreviewAside, { PreviewProvider } from '../components/usePreviewAside';
import useStackedAside from '../../../../components/react-admin/useStackedAside';

import {
  SQL,
  GEOJSON,
  GPKG,
  SHP,
  GEOFILE,
  WMTS,
  CSV,
  createSourceTypeChoices,
} from '..';

import DataSourceHelp from '../components/DataSourceHelp';

const required = (message = 'Required') => value => (value ? undefined : message);
const defaultRequired = required();

export const DataSourceCreate = props => {
  const { preview, publish, open, toggle, available } = usePreviewAside();
  const stacked = useStackedAside();

  return (
    <PreviewProvider value={publish}>
      <Create
        classes={stacked}
        {...props}
        actions={(
          <CreateActions previewAvailable={available} previewOpen={open} onTogglePreview={toggle} />
        )}
        aside={available && open ? <PreviewAside preview={preview} /> : undefined}
      >
        <SimpleForm>
          <DataSourceMainFields />

          <DataSourceTypeInput
            source="_type"
            label="datasource.form.data-type"
            validate={defaultRequired}
            choices={createSourceTypeChoices}
          />

          <DataSourceHelp />

          <FormDataConsumer>
            {({ formData: { _type: type } = {}, ...rest }) =>
              type === WMTS && <DataSourceWMTSField {...rest} />}
          </FormDataConsumer>

          <FormDataConsumer>
            {({ formData: { _type: type } = {}, ...rest }) =>
              [GEOFILE, GEOJSON, SHP, GPKG].includes(type)
              && <DataSourceFileFields {...rest} type={type} />}
          </FormDataConsumer>

          <FormDataConsumer>
            {({ formData: { _type: type } = {}, ...rest }) =>
              type === SQL && <DataSourceDbFields {...rest} />}
          </FormDataConsumer>

          <FormDataConsumer>
            {({ formData: { _type: type } = {}, ...rest }) =>
              type === CSV && <DataSourceCSVFields {...rest} type={type} />}
          </FormDataConsumer>
        </SimpleForm>
      </Create>
    </PreviewProvider>
  );
};

export default DataSourceCreate;
