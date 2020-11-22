import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import SizeStyleField from './SizeStyleField';
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

const WizardFillExtrusion = ({ path, fields }) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Extrusion color</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.fill_extrusion_color.type`}
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
          path={`${path}.style.fill_extrusion_color`}
          fields={fields}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel style={{ width: '9em' }}>Extrusion height</FormLabel>
          <div className="grow" />
          <div style={{ float: 'right' }}>
            <RadioButtonGroupInput
              label=""
              source={`${path}.style.fill_extrusion_height.type`}
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

        <SizeStyleField
          path={`${path}.style.fill_extrusion_height`}
          fields={fields}
        />
      </div>
    </>
  );
};

export default WizardFillExtrusion;
