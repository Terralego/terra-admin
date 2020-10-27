import React from 'react';

import {
  FormTab,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  useTranslate,
  BooleanInput,
} from 'react-admin';

import { useField } from 'react-final-form';

import Typography from '@material-ui/core/Typography';

import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import { required } from '../../../../../../utils/react-admin/validate';
import { getLayerStyleDefaultValue, getShapeFromGeomType } from '../../../../../../utils/geom';

import useRandomColor from '../../useRandomColor';
import useSourceData from '../../useSourceData';


import Placeholder from '../../../../../../components/Placeholder';


const defaultRequired = required();

const Advanced = ({ filterConfig, setFilterConfig }) => {
  const translate = useTranslate();
  const randomColor = useRandomColor();
  const { geom_type: geomType } = useSourceData('source');
  const { input: { value: advancedStyle } } = useField('settings.advanced_style');

  if (geomType === undefined) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">
          {translate('datalayer.form.styles.no-source')}
        </Typography>
      </Placeholder>
    );
  }

  return (
    <>
      <StyleField
        source="layer_style"
        withSource="source"
        label="datalayer.form.styles.mainstyle"
        initialValue={getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType))}
        fullWidth
      />


      <NumberInput
        source="settings.default_opacity"
        label="datalayer.form.styles.default_opacity"
        step={5}
        defaultValue={100}
        min={0}
        max={100}
        validate={defaultRequired}
      />

      <ArrayInput source="custom_styles" label="datalayer.form.styles.secondarylabels" fullWidth>
        <SimpleFormIterator>
          <CustomLayer />
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
};

export default Advanced;
