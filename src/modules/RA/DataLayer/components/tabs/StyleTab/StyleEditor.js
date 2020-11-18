import React from 'react';

import { useField, useForm } from 'react-final-form';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';

import randomColor from 'randomcolor';

import { getLayerStyleDefaultValue, getShapeFromGeomType } from '../../../../../../utils/geom';

import Condition from '../../../../../../components/react-admin/Condition';

import { fieldTypes } from '../../../../DataSource';

import FillSimple from './Style/FillSimple';
import FillGraduate from './Style/FillGraduate';
import WizardPolygon from './Style/WizardPolygon';

import StyleField from './StyleField';


const StyleEditor = ({ path, geomType, fields }) => {
  const translate = useTranslate();

  const {
    input: { value: styleConfig },
  } = useField(path);

  // const form = useForm();

  const styleType = getShapeFromGeomType(geomType);

  /* React.useEffect(() => {
    if (!styleConfig.type) {
      form.change(
        path,
        { ...styleConfig, type: 'advanced' },
      );
    }
    const mapStyle = getLayerStyleDefaultValue(randomColor(), getShapeFromGeomType(geomType));
    if (!styleConfig.map_style /* || mapStyle.type !== styleConfig.map_style.type *) {
      form.change(
        path,
        { ...styleConfig, map_style: mapStyle },
      );
    }
  }, [form, geomType, path, styleConfig]); */

  return (
    <>
      {styleType === 'fill' && <h1>Polygone</h1>}
      {styleType === 'line' && <h1>Line</h1>}
      {styleType === 'circle' && <h1>Point</h1>}
      {!['fill', 'line', 'circle'].includes(styleType) && <h1>Other ({styleType})</h1>}

      <RadioButtonGroupInput
        source={`${path}.type`}
        choices={[
          { id: 'wizard', name: 'Assisted' },
          { id: 'advanced', name: 'Expert' },
        ]}
        initialValue="wizard"
      />

      <Condition when={`${path}.type`} is="wizard">
        {styleConfig.type === 'wizard' && (
          <WizardPolygon path={path} fields={fields} />
        )}
      </Condition>

      <Condition when={`${path}.type`} is="advanced">
        <StyleField
          source={`${path}.map_style`}
          label="datalayer.form.style.map"
          fullWidth
        />
      </Condition>
    </>
  );
};

export default StyleEditor;
