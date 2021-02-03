import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import useAppSettings from '../../../../../../../hooks/useAppSettings';

import ColorStyleField from './ColorStyleField';
import SizeStyleField from './SizeStyleField';
import TextStyleField from './TextStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const defaultFontList = [
  { id: 'Arial Unicode MS Regular', name: 'Arial Unicode MS Regular' },
  { id: 'Arial Unicode MS Bold', name: 'Arial Unicode MS Bold' },
  { id: 'DIN Pro Regular', name: 'DIN Pro Regular' },
  { id: 'DIN Pro Medium', name: 'DIN Pro Medium' },
  { id: 'DIN Pro Bold', name: 'DIN Pro Bold' },
  { id: 'DIN Pro Italic', name: 'DIN Pro Italic' },
  { id: 'DIN Pro Regular', name: 'DIN Pro Regular' },
  { id: 'Knewave Regular', name: 'Knewave Regular' },
  { id: 'Knewave Outline Regular', name: 'Knewave Outline Regular' },
  { id: 'League Mono Bold', name: 'League Mono Bold' },
  { id: 'Old Standard TT Bold', name: 'Old Standard TT Bold' },
  { id: 'Orbitron Medium', name: 'Orbitron Medium' },
  { id: 'Oswald Medium', name: 'Oswald Medium' },
  { id: 'Overpass Mono SemiBold', name: 'Overpass Mono SemiBold' },
  { id: 'Roboto Mono Medium', name: 'Roboto Mono Medium' },
  { id: 'Roboto Mono Medium Italic', name: 'Roboto Mono Medium Italic' },
  { id: 'Sniglet Regular', name: 'Sniglet Regular' },
  { id: 'Source Code Pro Medium', name: 'Source Code Pro Medium' },
];

const formatFontValue = val => (val ? val[0] : null);
const parseFontValue = val => [val];
const formatFieldValue = val => val?.slice(1, -1);
const parseFieldValue = val => `{${val}}`;

const WizardCircle = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const { fontList = defaultFontList } = useAppSettings();

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
          <FormLabel>{translate('style-editor.text.text-field')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_field.type`}
            helperText={false}
            choices={[{ id: 'fixed', name: translate('style-editor.style-type.fixed') }]}
            initialValue="fixed"
          />
        </header>

        <TextStyleField
          path={`${path}.style.text_field`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
          choices={fieldChoices}
          format={formatFieldValue}
          parse={parseFieldValue}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.text.text-font')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_font.type`}
            helperText={false}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            initialValue="none"
          />
        </header>

        <TextStyleField
          path={`${path}.style.text_font`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
          choices={fontList}
          format={formatFontValue}
          parse={parseFontValue}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.text.text-color')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_color.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              {
                id: 'variable',
                name: translate('style-editor.style-type.variable'),
              },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <ColorStyleField
          path={`${path}.style.text_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.text.text-size')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_size.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              {
                id: 'variable',
                name: translate('style-editor.style-type.variable'),
              },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.text_size`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.text.halo-color')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_halo_color.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <ColorStyleField
          path={`${path}.style.text_halo_color`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.text.halo-width')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.text_halo_width.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.text_halo_width`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
    </>
  );
};

export default WizardCircle;
