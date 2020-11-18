import React from 'react';
import {
  SelectInput,
  ReferenceInput,
} from 'react-admin';

import useSourceData from '../../useSourceData';

import FieldGroup from '../../../../../../components/react-admin/FieldGroup';
import { RES_DATASOURCE } from '../../../../ra-modules';

import StyleEditor from './StyleEditor';

export const CustomLayer = ({ source, fields }) => {
  const { geom_type: geomType } = useSourceData(`${source}.source`);

  return (
    <FieldGroup>
      <ReferenceInput
        source={`${source}.source`}
        reference={RES_DATASOURCE}
        label="datalayer.form.data-source"
        sort={{ field: 'name', order: 'ASC' }}
        perPage={100}
      >
        <SelectInput />
      </ReferenceInput>
      {geomType !== undefined && <StyleEditor path={`${source}.style_config`} geomType={geomType} fields={fields} />}
    </FieldGroup>
  );
};

export default CustomLayer;
