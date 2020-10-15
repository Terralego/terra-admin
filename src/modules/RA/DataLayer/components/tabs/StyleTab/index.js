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
import JSONInput from '../../../../../../components/react-admin/JSONInput';

import CustomLayer from './CustomLayer';
import StyleField from './StyleField';

import { required } from '../../../../../../utils/react-admin/validate';
import { getLayerStyleDefaultValue, getShapeFromGeomType } from '../../../../../../utils/geom';

import useRandomColor from '../../useRandomColor';
import useSourceData from '../../useSourceData';


import Placeholder from '../../../../../../components/Placeholder';

const defaultRequired = required();

const StyleTab = ({ external }) => {
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
    <FormTab disabled={external} label="datalayer.form.styles.tab" path="style">
      <BooleanInput source="settings.advanced_style" label="datalayer.form.styles.advanced" />
      {advancedStyle && (
        <>
          <StyleField
            source="layer_style"
            withSource="source"
            label="datalayer.form.styles.mainstyle"
            initialValue={getLayerStyleDefaultValue(randomColor, getShapeFromGeomType(geomType))}
            fullWidth
          />

          <JSONInput
            source="layer_style_wizard"
            label="datalayer.form.styles.wizard_style"
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
      )}
      {!advancedStyle && (
        <>
          <Placeholder>
            <Typography variant="h5" component="h2">
              In construction
            </Typography>
          </Placeholder>
        </>
      )}
    </FormTab>
  );
};

export default StyleTab;