import React from 'react';

import { useField } from 'react-final-form';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';

import randomColor from 'randomcolor';

import { getLayerStyleDefaultValue, getShapeFromGeomType } from '../../../../../../utils/geom';

import Condition from '../../../../../../components/react-admin/Condition';

import { fieldTypes } from '../../../../DataSource';

import WizardFill from './Style/WizardFill';
import WizardFillExtrusion from './Style/WizardFillExtrusion';
import WizardLine from './Style/WizardLine';
import WizardCircle from './Style/WizardCircle';

import StyleField from './StyleField';


const StyleEditor = ({ path, geomType, fields, getValuesOfProperty }) => {
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
      {styleType === 'fill' && <h1>Polygon</h1>}
      {styleType === 'line' && <h1>Line</h1>}
      {styleType === 'circle' && <h1>Point</h1>}
      {!['fill', 'line', 'circle'].includes(styleType) && (
        <h1>Other ({styleType})</h1>
      )}

      <div>
        <RadioButtonGroupInput
          source={`${path}.type`}
          choices={[
            { id: 'wizard', name: 'Assisted' },
            { id: 'advanced', name: 'Expert' },
          ]}
          initialValue="wizard"
        />
      </div>

      {styleType === 'fill' && (
        <RadioButtonGroupInput
          source={`${path}.map_style_type`}
          choices={[
            { id: 'fill', name: 'Fill' },
            { id: 'fill-extrusion', name: 'Extrusion' },
          ]}
          initialValue="fill"
        />
      )}

      {styleType === 'line' && (
        <RadioButtonGroupInput
          source={`${path}.map_style_type`}
          choices={[
            { id: 'line', name: 'Line' },
          ]}
          initialValue="line"
        />
      )}

      {styleType === 'circle' && (
        <RadioButtonGroupInput
          source={`${path}.map_style_type`}
          choices={[
            { id: 'circle', name: 'Circle' },
            { id: 'symbol', name: 'Symbol' },
            { id: 'text', name: 'Text' },
          ]}
          initialValue="circle"
        />
      )}


      <Condition when={`${path}.type`} is="wizard">
        <Condition when={`${path}.map_style_type`} is="fill">
          <WizardFill path={path} fields={fields} getValuesOfProperty={getValuesOfProperty} />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="fill-extrusion">
          <WizardFillExtrusion path={path} fields={fields} getValuesOfProperty={getValuesOfProperty} />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="line">
          <WizardLine path={path} fields={fields} getValuesOfProperty={getValuesOfProperty} />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="circle">
          <WizardCircle path={path} fields={fields} getValuesOfProperty={getValuesOfProperty} />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="symbol">
          <p>To be done</p>
        </Condition>
        <Condition when={`${path}.map_style_type`} is="text">
          <p>To be done</p>
        </Condition>
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
