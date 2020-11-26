import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import ColorStyleField from './ColorStyleField';
import SizeStyleField from './SizeStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const WizardLine = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.line.line-color')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.line_color.type`}
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
          path={`${path}.style.line_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.line.line-width')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.line_width.type`}
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
          path={`${path}.style.line_width`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>
            {translate('style-editor.line.line-opacity')}
          </FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.line_opacity.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.line_opacity`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
    </>
  );
};

export default WizardLine;
