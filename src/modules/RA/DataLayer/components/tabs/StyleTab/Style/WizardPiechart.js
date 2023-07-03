import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import PiePieceStyleField from './PiePieceStyleField';
import RadiusStyleField from './RadiusStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const WizardPiechart = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.pie-chart.fields')}</FormLabel>
          <div style={{ height: 56 }} />
        </header>

        <PiePieceStyleField
          path={`${path}.advanced_style`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.circle.circle-radius')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source="main_style.style.piechart_radius.type"
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <RadiusStyleField
          path="main_style.style.piechart_radius"
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.pie-chart.total')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.advanced_style.show_total`}
            optionValue="value"
            choices={[
              { id: 'hide', value: false, name: translate('style-editor.pie-chart.hide') },
              { id: 'show', value: true, name: translate('style-editor.pie-chart.show') },
            ]}
            helperText={false}
            initialValue="show"
          />
        </header>
      </div>
    </>
  );
};

export default WizardPiechart;
