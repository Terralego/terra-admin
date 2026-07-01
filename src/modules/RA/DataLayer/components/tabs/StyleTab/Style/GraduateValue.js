import React from 'react';

import randomColor from 'randomcolor';
import { useTranslate, SelectInput, required } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Field, useField, useForm } from 'react-final-form';

import ManualBreaks, { roundTo } from './ManualBreaks';
import ValueListField from './ValueListField';
import { DEFAULT_MAX_CLASSES } from './ColorListField';

import StatsPreview from './StatsPreview';
import DistribPreview from './DistribPreview';
import DiscretPreview from './DiscretPreview';

import styles from './styles';

const isRequired = [required()];

const useStyles = makeStyles(styles);

const defValue = [1, 2, 3];

const GraduateValue = ({ path, Component = ValueListField,
  defaultValue = defValue,
  layerName }) => {
  const translate = useTranslate();
  const classes = useStyles();
  const statsWrapperRef = React.useRef(null);
  const distribWrapperRef = React.useRef(null);
  const rowRef = React.useRef(null);
  const [matchMinHeight, setMatchMinHeight] = React.useState(0);
  const [rowWidth, setRowWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([entry]) => { setRowWidth(entry.target.offsetWidth); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (statsWrapperRef.current && distribWrapperRef.current) {
        const sh = statsWrapperRef.current.offsetHeight;
        const dh = distribWrapperRef.current.offsetHeight;
        if (sh > 0 && dh > 0) {
          setMatchMinHeight(Math.max(sh, dh));
          ro.disconnect();
        }
      }
    });
    if (statsWrapperRef.current) ro.observe(statsWrapperRef.current);
    if (distribWrapperRef.current) ro.observe(distribWrapperRef.current);
    return () => ro.disconnect();
  }, []);

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
        for (let k = 0; k < newCount - old.length; k += 1) {
          const pos = next.length - 1;
          next.splice(pos, 0, roundTo((next[pos - 1] + next[pos]) / 2));
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
              { id: 'equal_interval', name: translate('style-editor.graduate.method.equal-interval') },
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
        <ManualBreaks boundaries={boundaries} setBoundaries={setBoundaries} />
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

      <div ref={rowRef} style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <Accordion defaultExpanded style={{ margin: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{ paddingLeft: 32 }}>
              <Typography style={{ fontWeight: 'bold' }}>{translate('discret.summary')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div ref={statsWrapperRef} style={{ width: '100%', minHeight: matchMinHeight || undefined }}>
                <StatsPreview layerName={layerName} path={path} />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div style={{ flex: 2 }}>
          <Accordion defaultExpanded style={{ margin: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography style={{ fontWeight: 'bold' }}>{translate('discret.distribution')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div ref={distribWrapperRef} style={{ minHeight: matchMinHeight || undefined }}>
                <DistribPreview layerName={layerName} path={path} />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <div style={{ marginTop: 16, width: rowWidth || undefined, flexShrink: 0 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography style={{ fontWeight: 'bold' }}>{translate('discret.preview')}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DiscretPreview layerName={layerName} path={path} />
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};

export default GraduateValue;
