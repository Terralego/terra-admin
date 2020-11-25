import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { Field } from 'react-final-form';

import ColorStyleField from './ColorStyleField';

const useStyles = makeStyles({
  configLine: {
    '& header': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 1em',
      backgroundColor: '#eee',
      marginBottom: '1em',
      width: '50%',
      '& > .grow': {
        flex: 1,
      },
    },
    paddingBottom: '1em',
  },
});

const WizardPolygon = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Background color</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.fill_color.type`}
              choices={[
                { id: 'none', name: 'None' },
                { id: 'fixed', name: 'Fixed' },
                { id: 'variable', name: 'Variable' },
              ]}
              helperText=""
              initialValue="none"
            />
          </div>
        </header>
        <ColorStyleField
          path={`${path}.style.fill_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Border color</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.fill_outline_color.type`}
              choices={[
                { id: 'none', name: 'None' },
                { id: 'fixed', name: 'Fixed' },
                { id: 'variable', name: 'Variable' },
              ]}
              helperText=""
              initialValue="none"
            />
          </div>
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
