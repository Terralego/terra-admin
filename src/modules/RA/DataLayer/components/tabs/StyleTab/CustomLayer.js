import React from 'react';
import {
  AutocompleteInput,
  ReferenceInput,
  useDataProvider,
  required,
} from 'react-admin';

import useSourceData from '../../useSourceData';

import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import { RES_DATASOURCE } from '../../../../ra-modules';

import StyleEditor from './StyleEditor';

const isRequired = [required()];

export const CustomLayer = ({ source }) => {
  const dataProvider = useDataProvider();
  const { geom_type: geomType, id: sourceId, fields } = useSourceData(`${source}.source`);

  const getValuesOfProperty = React.useCallback(property =>
    dataProvider('PROPERTY_VALUES', RES_DATASOURCE, { id: sourceId, property }),
  [dataProvider, sourceId]);

  return (
    <FieldGroup>
      <ReferenceInput
        source={`${source}.source`}
        reference={RES_DATASOURCE}
        label="datalayer.form.data-source"
        sort={{ field: 'name', order: 'ASC' }}
        perPage={100}
        validate={isRequired}
      >
        <AutocompleteInput
          validate={isRequired}
        />
      </ReferenceInput>
      {geomType !== undefined && (
        <StyleEditor
          path={`${source}.style_config`}
          geomType={geomType}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
          isExtraStyles
        />
      )}
    </FieldGroup>
  );
};

export default CustomLayer;
