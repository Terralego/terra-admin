import React from 'react';

import randomColor from 'randomcolor';
import { useTranslate, SelectInput, required } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import MuiTextField from '@mui/material/TextField';
import { Field, useField, useForm } from 'react-final-form';

import ValueListField from './ValueListField';
import { DEFAULT_MAX_CLASSES } from './ColorListField';

import StatsPreview from './StatsPreview';
import DistribPreview from './DistribPreview';
import DiscretPreview from './DiscretPreview';

import styles from './styles';

const formatNumber = n => {
  if (n == null) return '';
  return new Intl.NumberFormat('fr', { maximumFractionDigits: Number.isInteger(n) ? 0 : 2 }).format(n);
};

const isRequired = [required()];

const useStyles = makeStyles(styles);

const defValue = [1, 2, 3];

const GraduateValue = ({ path, Component = ValueListField,
  defaultValue = defValue,
  layerName }) => {
  const translate = useTranslate();
  const classes = useStyles();

  const { input: { value: values, onChange: onValuesChange } }
    = useField(`${path}.values`, { subscription: { value: true } });
  const v = Array.isArray(values) && values.length > 0 ? values : defaultValue;

  const form = useForm();
  const { input: { value: paletteType } } = useField(`${path}.palette_type`, { subscription: { value: true } });
  const { input: { value: paletteName } } = useField(`${path}.palette_name`, { subscription: { value: true } });
  const { input: { value: reversed } } = useField(`${path}.palette_reversed`, { subscription: { value: true } });

  const { input: { value: method } } = useField(`${path}.method`,
    { subscription: { value: true } });
  const { input: { value: boundaries, onChange: setBoundaries } } = useField(`${path}.boundaries`,
    { subscription: { value: true } });

  const handleMethodChange = eventOrValue => {
    const val = eventOrValue?.target?.value ?? eventOrValue;
    if (val !== 'manual') {
      form.change(`${path}.boundaries`, undefined);
    }
  };

  const prevValRef = React.useRef({});

  const handlePaletteTypeChange = val => {
    form.change(`${path}.palette_type`, val);
    form.change(`${path}.palette_name`, null);
  };
  const handlePaletteNameChange = val => form.change(`${path}.palette_name`, val);
  const handleReversedChange = val => form.change(`${path}.palette_reversed`, val);

  const handleCountChange = e => {
    let newCount = parseInt(e.target.value, 10);
    if (Number.isNaN(newCount)) return;
    newCount = Math.max(2, Math.min(newCount, DEFAULT_MAX_CLASSES));
    const old = v;
    if (newCount > old.length) {
      const added = Array.from(
        { length: newCount - old.length },
        () => randomColor(),
      );
      onValuesChange([...old, ...added]);
      if (method === 'manual' && boundaries && boundaries.length >= 2) {
        const next = [...boundaries];
        const r2 = x => Math.round(x * 100) / 100;
        for (let k = 0; k < newCount - old.length; k += 1) {
          const pos = next.length - 1;
          next.splice(pos, 0, r2((next[pos - 1] + next[pos]) / 2));
        }
        setBoundaries(next);
      }
    } else if (newCount < old.length) {
      onValuesChange(old.slice(0, newCount));
      if (method === 'manual' && boundaries && boundaries.length >= 2) {
        const removeCount = old.length - newCount;
        const next = [...boundaries];
        next.splice(next.length - 1 - removeCount, removeCount);
        setBoundaries(next);
      }
    }
  };

  return (
    <>
      <div className={classes.graduateConfig}>
        <div className="method">
          <SelectInput
            source={`${path}.method`}
            label="style-editor.graduate.method.input"
            validate={isRequired}
            onChange={handleMethodChange}
            choices={[
              { id: 'jenks', name: translate('style-editor.graduate.method.jenks') },
              { id: 'jenks_kmeans1d', name: translate('style-editor.graduate.method.jenks-kmeans1d') },
              { id: 'quantile', name: translate('style-editor.graduate.method.quantiles') },
              { id: 'quantile_mapclassify', name: translate('style-editor.graduate.method.quantiles-mapclassify') },
              { id: 'equal_interval', name: translate('style-editor.graduate.method.equal-interval') },
              { id: 'equal_interval_mapclassify', name: translate('style-editor.graduate.method.equal-interval-mapclassify') },
              { id: 'fisherjenkssampled', name: translate('style-editor.graduate.method.fisherjenkssampled') },
              { id: 'prettybreaks', name: translate('style-editor.graduate.method.prettybreaks') },
              { id: 'manual', name: translate('style-editor.graduate.method.manual') },
            ]}
          />
        </div>
        <div className="count">
          <TextField
            type="number"
            label={translate('style-editor.graduate.classes')}
            value={v.length}
            onChange={handleCountChange}
            inputProps={{ min: 2, max: DEFAULT_MAX_CLASSES, step: 1 }}
            margin="dense"
          />
        </div>
      </div>

      {method === 'manual' && boundaries && boundaries.length >= 2 && (
        <div
          className="manual-breaks"
          style={{ display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 25 }}
        >
          <span>{formatNumber(boundaries[0])}</span>
          <span style={{ margin: '0 4px' }}>-</span>
          {boundaries.slice(1, -1).map((b, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={i}>
              <MuiTextField
                type="text"
                inputMode="decimal"
                value={String(b).replace('.', ',')}
                onChange={e => {
                  const raw = e.target.value.replace(',', '.');
                  const next = [...boundaries];
                  const prev = next[i + 1];
                  const num = parseFloat(raw);
                  const r2 = x => Math.round(x * 100) / 100;
                  if (!Number.isNaN(num) && Math.abs(Math.abs(num - Number(prev)) - 1) < 0.001) {
                    const minVal = Number(boundaries[i]);
                    const maxVal = Number(boundaries[i + 2]);
                    const diff = num - Number(prev);
                    const adjusted = diff > 0
                      ? Math.floor(Number(prev)) + 1
                      : Math.ceil(Number(prev)) - 1;
                    let clamped = Math.min(Math.max(adjusted, minVal + 0.01), maxVal - 0.01);
                    if (r2(clamped) === r2(Number(prev)) && clamped < maxVal - 0.01) {
                      clamped = Math.min(Math.max(num, minVal + 0.01), maxVal - 0.01);
                    }
                    next[i + 1] = r2(clamped);
                    setBoundaries(next);
                    return;
                  }
                  next[i + 1] = raw;
                  setBoundaries(next);
                }}
                onFocus={() => { prevValRef.current[i] = boundaries[i + 1]; }}
                onBlur={e => {
                  const raw = parseFloat(e.target.value.replace(',', '.'));
                  if (Number.isNaN(raw)) return;
                  const minVal = Number(boundaries[i]);
                  const maxVal = Number(boundaries[i + 2]);
                  if (raw < minVal + 0.01 || raw > maxVal - 0.01) {
                    const next = [...boundaries];
                    next[i + 1] = prevValRef.current[i];
                    setBoundaries(next);
                    return;
                  }
                  const next = [...boundaries];
                  next[i + 1] = raw;
                  setBoundaries(next);
                }}
                onKeyDown={e => {
                  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
                  e.preventDefault();
                  const next = [...boundaries];
                  const prev = Number(next[i + 1]);
                  const minVal = Number(boundaries[i]);
                  const maxVal = Number(boundaries[i + 2]);
                  const r2 = x => Math.round(x * 100) / 100;
                  const increment = e.key === 'ArrowUp' ? 1 : -1;
                  const adjusted = increment > 0
                    ? Math.floor(prev) + 1
                    : Math.ceil(prev) - 1;
                  let clamped = Math.min(Math.max(adjusted, minVal + 0.01), maxVal - 0.01);
                  if (r2(clamped) === r2(prev) && clamped < maxVal - 0.01) {
                    clamped = Math.min(Math.max(prev + increment, minVal + 0.01), maxVal - 0.01);
                  }
                  next[i + 1] = r2(clamped);
                  setBoundaries(next);
                }}
                inputProps={{
                  style: { textAlign: 'center' },
                }}
                variant="outlined"
                size="small"
                sx={{ width: 110 }}
              />
              <span style={{ margin: '0 4px' }}>-</span>
            </React.Fragment>
          ))}
          <span>{formatNumber(boundaries[boundaries.length - 1])}</span>
        </div>
      )}

      <FormLabel>{translate('style-editor.graduate.steps')}</FormLabel>
      <Field name={`${path}.values`} defaultValue={defaultValue}>
        {({ input: { value, onChange } }) => (
          <Component
            value={value}
            onChange={onChange}
            showAddRemove={false}
            paletteType={['sequential', 'diverging', 'custom'].includes(paletteType) ? paletteType : 'custom'}
            selectedPalette={paletteName || null}
            reversed={reversed || false}
            onTypeChange={handlePaletteTypeChange}
            onPaletteSelect={handlePaletteNameChange}
            onReverseToggle={handleReversedChange}
          />
        )}
      </Field>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <StatsPreview layerName={layerName} path={path} />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
          <DistribPreview layerName={layerName} path={path} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 16 }}>
        <DiscretPreview layerName={layerName} path={path} />
      </div>
    </>
  );
};

export default GraduateValue;
