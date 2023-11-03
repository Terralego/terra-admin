import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import ColorStyleField from './ColorStyleField';

import styles from './styles';
import MapLabelField from './MapLabelField';

const useStyles = makeStyles(styles);

const WizardPolygon = ({ path, fields, getValuesOfProperty }) => {
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

export default WizardPolygon;
