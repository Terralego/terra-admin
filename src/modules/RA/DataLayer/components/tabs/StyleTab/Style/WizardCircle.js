import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import ColorStyleField from './ColorStyleField';
import RadiusStyleField from './RadiusStyleField';

const useStyles = makeStyles({
  configLine: {
    '& header': {
      display: 'flex',
      alignItems: 'center',
      padding: '0 1em',
      backgroundColor: '#eee',
      margingBottom: '1em',
      width: '50%',
      '& > .grow': {
        flex: 1,
      },
    },
    paddingBottom: '1em',
  },
});

const WizardCircle = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Circle color</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.circle_color.type`}
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
          path={`${path}.style.circle_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Circle radius</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.circle_radius.type`}
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

        <RadiusStyleField
          path={`${path}.style.circle_radius`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
    </>
  );
};

export default WizardCircle;
