import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import SizeStyleField from './SizeStyleField';
import ColorStyleField from './ColorStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const WizardFillExtrusion = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.extrusion.extrusion-color')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.fill_extrusion_color.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>
        <ColorStyleField
          path={`${path}.style.fill_extrusion_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.extrusion.extrusion-height')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.fill_extrusion_height.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.fill_extrusion_height`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.extrusion.extrusion-base')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.fill_extrusion_base.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.fill_extrusion_base`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

    </>
  );
};

export default WizardFillExtrusion;
