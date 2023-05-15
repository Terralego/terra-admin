import React from 'react';

import {
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  NumberInput,
  required,
  useTranslate,
} from 'react-admin';

import Typography from '@material-ui/core/Typography';
import { Field } from 'react-final-form';
import FormLabel from '@material-ui/core/FormLabel';
import Box from '@material-ui/core/Box';

import Condition from '../../../../../../components/react-admin/Condition';
import ColorPicker from '../../../../../../components/react-admin/ColorPicker';
import useSprites from '../../../../../../hooks/useSprites';
import useCustomStyleImages from '../../../../../../hooks/useCustomStyleImages';

const isRequired = [required()];

const LegendItemInput = ({ source, parentSource }) => {
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
      <Condition when={parentSource} is={({ shape }) => shape !== 'icon'}>
        <FormLabel>{translate('datalayer.form.legend.shape')}</FormLabel>
        <Field name={`${source}.color`} defaultValue="#00000000">
          {({ input: { onChange, value } }) => (
            <ColorPicker value={value || '#000000'} onChange={onChange} />
          )}
        </Field>
        <NumberInput source={`${source}.size`} label="datalayer.form.legend.size" style={{ width: '8em' }} helperText={false} />

        <FormLabel>{translate('datalayer.form.legend.stroke')}</FormLabel>
        <Field name={`${source}.strokeColor`} defaultValue={undefined}>
          {({ input: { onChange, value } }) => (
            <ColorPicker value={value || '#00000000'} onChange={onChange} />
          )}
        </Field>
        <NumberInput source={`${source}.strokeWidth`} label="datalayer.form.legend.width" style={{ width: '8em' }} helperText={false} />
      </Condition>

      <Condition when={parentSource} is={({ shape }) => shape === 'icon'}>
        <SelectInput
          source={`${source}.style-image`}
          label="datalayer.form.legend.icon"
          choices={iconChoices}
          translateChoice={false}
          helperText={false}
        />
      </Condition>

      <TextInput source={`${source}.label`} label="datalayer.form.legend.item-label" helperText={false} />
    </div>
  );
};

const LegendField = ({ source }) => {
  const translate = useTranslate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TextInput
        source={`${source}.title`}
        label="datalayer.form.legend.title"
      />

      <Condition when={`${source}.auto`} is={val => !val}>
        <SelectInput
          label="datalayer.form.legend.shape"
          source={`${source}.shape`}
          choices={[
            { id: 'square', name: 'datalayer.form.legend.square' },
            { id: 'line', name: 'datalayer.form.legend.line' },
            { id: 'circle', name: 'datalayer.form.legend.circle' },
            { id: 'stackedCircle', name: 'datalayer.form.legend.stacked-circle' },
            { id: 'icon', name: 'datalayer.form.legend.icon' },
          ]}
          helperText={false}
          validate={isRequired}
          initialValue="square"
          style={{ display: 'block' }}
        />

        <ArrayInput source={`${source}.items`} label="datalayer.form.legend.items">
          <SimpleFormIterator>
            <LegendItemInput parentSource={source} />
          </SimpleFormIterator>
        </ArrayInput>
      </Condition>

      <Condition when={`${source}.auto`} is>
        <Typography>{translate('datalayer.form.legend.automsg')}</Typography>
      </Condition>
      <TextInput source={`${source}.comment`} label="datalayer.form.legend.comment" />
    </div>
  );
};

export default React.memo(LegendField);
