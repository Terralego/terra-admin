import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import ColorStyleField from './ColorStyleField';
import SizeStyleField from './SizeStyleField';
import RadiusStyleField from './RadiusStyleField';

import styles from './styles';
import MapLabelField from './MapLabelField';

const useStyles = makeStyles(styles);

const WizardCircle = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();

  const fieldChoices = React.useMemo(
    () =>
      fields.map(field => ({
        id: field.name,
        name: `${field.label} (${field.name})`,
      })),
    [fields],
  );

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.circle.fill-color')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.circle_color.type`}
            helperText={false}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            initialValue="none"
          />
        </header>

        <ColorStyleField
          path={`${path}.style.circle_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.circle.circle-radius')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.circle_radius.type`}
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
          path={`${path}.style.circle_radius`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.circle.border-color')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.circle_stroke_color.type`}
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
          path={`${path}.style.circle_stroke_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.circle.border-width')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.circle_stroke_width.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.circle_stroke_width`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>

      <div className={classes.configLine}>
        <header>
          <FormLabel>Show value on map</FormLabel>
          <RadioButtonGroupInput
            label=""
            source="advanced_style.show_value_on_map.type"
            helperText={false}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            initialValue="none"
          />
        </header>

        <MapLabelField
          path="advanced_style.show_value_on_map"
          choices={fieldChoices}
        />
      </div>
    </>
  );
};

export default WizardCircle;
