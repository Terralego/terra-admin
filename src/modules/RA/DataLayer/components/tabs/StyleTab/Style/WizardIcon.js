import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import SizeStyleField from './SizeStyleField';
import IconStyleField from './IconStyleField';

import useSprites from '../../../../../../../hooks/useSprites';
import useCustomStyleImages from '../../../../../../../hooks/useCustomStyleImages';

import styles from './styles';

const useStyles = makeStyles(styles);

const WizardIcon = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const defaultSprites = useSprites();
  const customStyleImages = useCustomStyleImages();

  const customStyleImagesChoices = React.useMemo(
    () => customStyleImages.map(customImage => ({
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
    })),
    [customStyleImages],
  );

  const iconChoices = React.useMemo(
    () => [
      {
        id: 'separator-custom',
        name: translate('style-editor.icon.icon-image-custom'),
        disabled: true,
      },
      ...customStyleImagesChoices,
      {
        id: 'separator-native',
        name: translate('style-editor.icon.icon-image-native'),
        disabled: true,
      },
      ...defaultSprites,
    ],
    [translate, customStyleImagesChoices, defaultSprites],
  );

  return (
    <>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.icon.icon-image')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.icon_image.type`}
            helperText={false}
            choices={[
              { id: 'fixed', name: translate('style-editor.style-type.fixed') },
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            initialValue="fixed"
          />
        </header>

        <IconStyleField
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
              { id: 'variable', name: translate('style-editor.style-type.variable') },
            ]}
            helperText={false}
            initialValue="none"
          />
        </header>

        <SizeStyleField
          path={`${path}.style.icon_size`}
          fields={fields}
          step="0.1"
          canGenerateLegend={false}
          getValuesOfProperty={getValuesOfProperty}
        />
      </div>
      <div className={classes.configLine}>
        <header>
          <FormLabel>{translate('style-editor.icon.icon-overlap')}</FormLabel>
          <RadioButtonGroupInput
            label=""
            source={`${path}.style.icon_allow_overlap.type`}
            helperText={false}
            choices={[{ id: 'fixed', name: translate('style-editor.style-type.fixed') }]}
            initialValue="fixed"
          />
        </header>
        <RadioButtonGroupInput
          label=""
          source={`${path}.style.icon_allow_overlap.value`}
          choices={[
            { id: false, name: translate('style-editor.style-type.none') },
            { id: true, name: translate('style-editor.style-type.allow') },
          ]}
          helperText={false}
          initialValue={false}
        />
      </div>
    </>
  );
};

export default WizardIcon;
