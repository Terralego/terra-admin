import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import ColorStyleField from './ColorStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const WizardPolygon = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.fill.fill-color')}
          </FormLabel>

          <RadioButtonGroupInput
            label=""
            source={`${path}.style.fill_color.type`}
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
          path={`${path}.style.fill_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.fill.border-color')}
          </FormLabel>

          <RadioButtonGroupInput
            label=""
            source={`${path}.style.fill_outline_color.type`}
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
          path={`${path}.style.fill_outline_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

    </>
  );
};

export default WizardPolygon;
