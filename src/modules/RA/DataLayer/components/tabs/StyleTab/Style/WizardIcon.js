import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import { useFormState } from 'react-final-form';

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

  const { values: { style_images: styleImages } = {} } = useFormState();

  React.useEffect(() => {
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
        // Sort by name
        choices.sort(({ name: name1 }, { name: name2 }) => name1.localeCompare(name2));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error while getting icons', e);
        choices = [];
      }

      if (mounted) {
        const customImages = styleImages
          ?.filter(({ name, slug, file } = {}) => Boolean(name && slug && file));

        choices.unshift({
          id: 'separator-native',
          name: translate('style-editor.icon.icon-image-native'),
          disabled: true,
        });

        if (customImages?.length) {
          const customChoices = customImages.map(customImage => ({
            id: customImage.slug,
            name: (
              <>
                {customImage.name}
                <Box
                  component="img"
                  src={customImage.file}
                  sx={{ maxWidth: 24, maxHeight: 24, ml: 'auto' }}
                />
              </>
            ),
          }));
          choices.unshift(
            {
              id: 'separator-custom',
              name: translate('style-editor.icon.icon-image-custom'),
              disabled: true,
            },
            ...customChoices,
          );
        }

        setIconChoices(choices);
      }
    };
    loadIconChoices();

    return () => {
      mounted = false;
    };
  }, [styleImages, spriteBaseUrl, translate]);

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
          translateChoice={false}
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
