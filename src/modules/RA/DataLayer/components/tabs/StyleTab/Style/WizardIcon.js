import React from 'react';

import { useTranslate, RadioButtonGroupInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import SizeStyleField from './SizeStyleField';
import IconStyleField from './IconStyleField';

import styles from './styles';
import useStyleImagesOptions from '../../../../../../../hooks/useStyleImagesOptions';

const useStyles = makeStyles(styles);

const WizardIcon = ({ path, fields, getValuesOfProperty }) => {
  const classes = useStyles();
  const translate = useTranslate();
  const iconChoices = useStyleImagesOptions();

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
