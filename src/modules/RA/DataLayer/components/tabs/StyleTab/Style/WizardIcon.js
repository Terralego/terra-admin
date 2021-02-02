import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';

import useAppSettings from '../../../../../../../hooks/useAppSettings';
import TextStyleField from './TextStyleField';
import SizeStyleField from './SizeStyleField';

import styles from './styles';

const useStyles = makeStyles(styles);

const defaultSpriteBaseUrl = 'https://makina-icon.netlify.app/sprite';

const WizardIcon = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const [iconChoices, setIconChoices] = React.useState([]);
  const { spriteBaseUrl = defaultSpriteBaseUrl } = useAppSettings();

  React.useState(() => {
    let mounted = true;
    const loadIconChoices = async () => {
      let choices;
      try {
        const data = await (await fetch(`${spriteBaseUrl}.json`)).json();
        choices = Object.entries(data).map(([key, value]) => ({
          id: key,
          name: key,
          ...value,
        }));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while getting icons', e);
        choices = [];
      }
      if (mounted) {
        setIconChoices(choices);
      }
    };
    loadIconChoices();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.icon.icon-image')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.icon_image.type`}
            helperText={false}
            choices={[{ id: 'fixed', name: translate('style-editor.style-type.fixed') }]}
            initialValue="fixed"
          />
        </header>

        <TextStyleField
          path={`${path}.style.icon_image`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
          choices={iconChoices}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.icon.icon-size')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.icon_size.type`}
            choices={[
              { id: 'none', name: translate('style-editor.style-type.none') },
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.icon_size`}
          fields={fields}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
    </>
  );
};

export default WizardIcon;
