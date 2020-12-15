import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import { getShapeFromGeomType } from '../../../../../../utils/geom';
import Condition from '../../../../../../components/react-admin/Condition';

import WizardFill from './Style/WizardFill';
import WizardFillExtrusion from './Style/WizardFillExtrusion';
import WizardLine from './Style/WizardLine';
import WizardCircle from './Style/WizardCircle';

import ExpertStyleField from './ExpertStyleField';

import styles from './Style/styles';

const useStyles = makeStyles(styles);

const StyleEditor = ({ path, geomType, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const styleType = getShapeFromGeomType(geomType);

  return (
    <div className={classes.styleEditor}>
      <div
        className="wizard-select"
      >
        <RadioButtonGroupInput
          source={`${path}.type`}
          label={translate('style-editor.type.input')}
          choices={[
            { id: 'wizard', name: translate('style-editor.type.wizard') },
            { id: 'advanced', name: translate('style-editor.type.expert') },
          ]}
          initialValue="wizard"
          helperText={false}
        />
      </div>

      <h1>
        {['fill', 'line', 'circle'].includes(styleType)
          ? <>{translate('style-editor.geometry')}</>
          : <>{translate('style-editor.other', { type: styleType })}</>}
        {styleType === 'fill' && <>{translate('style-editor.polygon')}</>}
        {styleType === 'line' && <>{translate('style-editor.line-type')}</>}
        {styleType === 'circle' && <>{translate('style-editor.point')}</>}
      </h1>


      <Condition when={`${path}.type`} is="wizard">
        {styleType === 'fill' && (
          <RadioButtonGroupInput
            source={`${path}.map_style_type`}
            label={translate('style-editor.map-style-type.input')}
            choices={[
              {
                id: 'fill',
                name: translate('style-editor.map-style-type.fill'),
              },
              {
                id: 'line',
                name: translate('style-editor.map-style-type.line'),
              },
              {
                id: 'fill-extrusion',
                name: translate('style-editor.map-style-type.extrusion'),
              },
            ]}
            initialValue="fill"
            helperText={false}
          />
        )}

        {styleType === 'line' && (
          <RadioButtonGroupInput
            source={`${path}.map_style_type`}
            label={translate('style-editor.map-style-type.input')}
            choices={[
              {
                id: 'line',
                name: translate('style-editor.map-style-type.line'),
              },
            ]}
            initialValue="line"
          />
        )}

        {styleType === 'circle' && (
          <RadioButtonGroupInput
            source={`${path}.map_style_type`}
            label={translate('style-editor.map-style-type.input')}
            choices={[
              {
                id: 'circle',
                name: translate('style-editor.map-style-type.circle'),
              },
              /* {
                id: 'heatmap',
                name: translate('style-editor.map-style-type.heatmap'),
              },
              {
                id: 'symbol',
                name: translate('style-editor.map-style-type.symbol'),
              },
              {
                id: 'text',
                name: translate('style-editor.map-style-type.text'),
              }, */
            ]}
            initialValue="circle"
          />
        )}
        <Condition when={`${path}.map_style_type`} is="fill">
          <WizardFill
            path={path}
            fields={fields}
            getValuesOfProperty={getValuesOfProperty}
          />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="fill-extrusion">
          <WizardFillExtrusion
            path={path}
            fields={fields}
            getValuesOfProperty={getValuesOfProperty}
          />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="line">
          <WizardLine
            path={path}
            fields={fields}
            getValuesOfProperty={getValuesOfProperty}
          />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="circle">
          <WizardCircle
            path={path}
            fields={fields}
            getValuesOfProperty={getValuesOfProperty}
          />
        </Condition>
        <Condition when={`${path}.map_style_type`} is="symbol">
          <p>To be done</p>
        </Condition>
        <Condition when={`${path}.map_style_type`} is="text">
          <p>To be done</p>
        </Condition>
        <Condition when={`${path}.map_style_type`} is="heatmap">
          <p>To be done</p>
        </Condition>
      </Condition>

      <Condition when={`${path}.type`} is="advanced">
        <ExpertStyleField
          source={`${path}.map_style`}
          label="style-editor.advanced-style"
          fullWidth
        />
      </Condition>
    </div>
  );
};

export default StyleEditor;
