import React, { useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ZoomOut from '@material-ui/icons/ZoomOut';
import ZoomIn from '@material-ui/icons/ZoomIn';

import {
  ArrayInput,
  required,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  SimpleFormIterator,
  translate,
} from 'react-admin';
import ZoomInput from './ZoomInput';

import FieldGroup from '../../../../components/react-admin/FieldGroup';

import compose from '../../../../utils/compose';

const styles = {
  inline: {
    display: 'inline-block',
    marginRight: '1em',
  },
};

const getTileSizeChoices = ({ min = 256, max = 4096 } = {}) => {
  const logMin = Math.log2(min);
  const logMax = Math.log2(max);
  return Array.from({ length: logMax - logMin + 1 }, ((_, index) => {
    const number = 2 ** (logMin + index);
    return {
      id: number,
      name: number.toString(),
    };
  }));
};


const BaseLayerForm = ({ basePath, classes, translate: t, ...props }) => {
  const { record: { base_layer_type: layerType } } = props;

  const [currentLayerType, setLayerType] = useState(layerType);

  const tileSizeInitialValue = currentLayerType === 'raster' ? 256 : 512;

  const handleTypeChange = useCallback(({ target: { value } }) => {
    setLayerType(value);
  }, []);

  const validateURL = React.useCallback(value => {
    if (!value) {
      return undefined;
    }
    return !value.match(/(^(?:mapbox:|https?:)?\/\/.)/)
      ? t('baseLayer.form.errors.url')
      : undefined;
  }, [t]);

  const validateTiles = React.useCallback(value => {
    if (!value) {
      return undefined;
    }
    const isURLValid = validateURL(value);
    if (isURLValid !== undefined) {
      return isURLValid;
    }
    return (['{x}', '{y}', '{z}'].some(item => !value.includes(item)) && !value.includes('{bbox-epsg-3857}'))
      ? t('baseLayer.form.errors.mandatoryTilesWord')
      : undefined;
  }, [t, validateURL]);

  const validateGlyphs = React.useCallback(value => {
    if (!value) {
      return undefined;
    }
    const isURLValid = validateURL(value);
    if (isURLValid !== undefined) {
      return isURLValid;
    }
    if (!value.includes('{fontstack}')) {
      return t('baseLayer.form.errors.mandatoryWord', { name: '{fontstack}' });
    }
    if (!value.includes('{range}')) {
      return t('baseLayer.form.errors.mandatoryWord', { name: '{range}' });
    }
    return undefined;
  }, [t, validateURL]);

  return (
    <SimpleForm sanitizeEmptyValues={false} {...props}>
      <TextInput source="name" label="baseLayer.form.name" validate={required()} />

      <SelectInput
        choices={[
          { id: 'raster', name: t('baseLayer.form.type.choices.raster') },
          { id: 'vector', name: t('baseLayer.form.type.choices.vector') },
          { id: 'mapbox', name: t('baseLayer.form.type.choices.mapbox') },
        ]}
        disabled={Boolean(layerType)}
        label="baseLayer.form.type.select"
        onChange={handleTypeChange}
        source="base_layer_type"
        validate={required()}
      />

      {currentLayerType && (
        <FieldGroup>
          <SelectInput
            choices={getTileSizeChoices(({ min: tileSizeInitialValue }))}
            initialValue={tileSizeInitialValue}
            label="baseLayer.form.tileSize"
            source="tile_size"
            translateChoice={false}
            validate={required()}
          />

          {currentLayerType === 'mapbox' && (
            <TextInput
              label="baseLayer.form.mapBoxUrl"
              source="map_box_url"
              type="url"
              validate={[required(), validateURL]}
            />
          )}

          {currentLayerType !== 'mapbox' && (
            <ArrayInput
              label="baseLayer.form.tiles"
              initialValue={['']}
              source="tiles"
              validate={required()}
            >
              <SimpleFormIterator>
                <TextInput label="URL" validate={[required(), validateTiles]} />
              </SimpleFormIterator>
            </ArrayInput>
          )}

          <>
            <Typography id="zoom-slider" gutterBottom>
              {t('baseLayer.form.minMaxZoom')}
            </Typography>
          </>
          <ZoomInput
            aria-labelledby="zoom-slider"
            min={0}
            max={24}
            nextElement={ZoomIn}
            prevElement={ZoomOut}
            initialValue={[0, 20]}
          />

          <TextInput source="sprite" type="url" validate={[validateURL]} />
          <TextInput source="glyphs" type="url" validate={[validateGlyphs]} />

          <TextInput source="attribution" />

          <NumberInput source="order" label="baseLayer.form.order" min={0} step={1} />
        </FieldGroup>
      )}

    </SimpleForm>
  );
};
export default compose(
  translate,
  withStyles(styles),
)(BaseLayerForm);
