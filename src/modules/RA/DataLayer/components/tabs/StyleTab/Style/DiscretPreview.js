import React from 'react';
import { useField, useForm } from 'react-final-form';
import { useTranslate } from 'react-admin';
import Api from '@terralego/core/modules/Api';

import { makeStyles } from '@material-ui/core/styles';

import Loading from '../../../../../../../components/Loading';
import styles from './styles';
import ClassifGraph, { MEAN_COLOR, MEDIAN_COLOR, STDDEV_COLOR } from './ClassifGraph';
import ClassifBucket from './ClassifBucket';
import ClassifBornes from './ClassifBornes';

const useStyles = makeStyles(styles);

const DiscretPreview = ({ layerName, path }) => {
  const translate = useTranslate();
  const classes = useStyles();

  const fieldName = `${path}.field`;
  const { input: { value: selectedField } } = useField(fieldName,
    { subscription: { value: true } });

  const methodName = `${path}.method`;
  const { input: { value: method } } = useField(methodName,
    { subscription: { value: true } });

  const valuesName = `${path}.values`;
  const { input: { value: values } } = useField(valuesName,
    { subscription: { value: true } });

  const boundariesName = `${path}.boundaries`;
  const { input: { value: boundaries } } = useField(boundariesName,
    { subscription: { value: true } });

  const form = useForm();

  const [data, setData] = React.useState(null);

  const classCount = values?.length || 0;

  const breaksData = React.useMemo(() => {
    if (!data) return [];
    const { breaks, entitiesByClass } = data;
    if (!breaks || breaks.length < 2 || !entitiesByClass) return [];
    if (values && values.length !== breaks.length - 1) return [];

    const isColor = typeof values?.[0] === 'string';
    const palette = isColor ? values : undefined;

    const result = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < breaks.length - 1; i++) {
      result.push({
        x1: breaks[i],
        x2: breaks[i + 1],
        count: entitiesByClass[i] || 0,
        color: palette?.[i] || '#ccc',
      });
    }
    return result;
  }, [data, values]);

  const graphContent = React.useMemo(() => {
    if (!data) return <Loading spinner />;
    if (data.stats?.min == null) return <div style={{ color: '#999' }}>{translate('discret.not-numeric')}</div>;
    return (
      <ClassifGraph
        breaksData={breaksData}
        stats={data.stats}
      />
    );
  }, [data, breaksData, translate]);

  const dataRef = React.useRef(data);
  dataRef.current = data;

  React.useEffect(() => {
    let cancelled = false;

    if (!layerName || !selectedField || !method || classCount < 2) {
      setData(null);
      return () => { cancelled = true; };
    }

    const r2 = x => Math.round(x * 100) / 100;

    if (method === 'manual') {
      if (boundaries && boundaries.some(b => typeof b === 'string')) {
        return () => { cancelled = true; };
      }
      if (!boundaries || boundaries.length < 2) {
        if (dataRef.current?.breaks?.length >= 2) {
          form.change(`${path}.boundaries`, dataRef.current.breaks.map(r2));
        }
        return () => { cancelled = true; };
      }
      if (dataRef.current?.breaks?.length >= 2) {
        const cached = dataRef.current.breaks.map(r2);
        if (boundaries.length === cached.length
          && boundaries.every((b, i) => Number(b) === cached[i])) {
          return () => { cancelled = true; };
        }
      }
      setData(null);
      Api.request(`geo-api/${layerName}/feature/discretize/${selectedField}/`
        + `?method=manual&classes=${classCount}`
        + `&breaks=${encodeURIComponent(boundaries.join(','))}`)
        .then(resp => {
          if (!cancelled) {
            setData(resp);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setData(null);
          }
        });
      return () => { cancelled = true; };
    }

    setData(null);
    Api.request(`geo-api/${layerName}/feature/discretize/${selectedField}/`
      + `?method=${method}&classes=${classCount}`)
      .then(resp => {
        if (!cancelled) {
          setData(resp);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
        }
      });

    return () => { cancelled = true; };
  }, [layerName, selectedField, method, classCount, boundaries, form, path]);

  if (!selectedField) return null;
  if (!method) return <div style={{ color: '#999', padding: 24, textAlign: 'center' }}>{translate('discret.choose-method')}</div>;

  return (
    <div className={classes.discretContainer} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 334 }}>
      <div style={{ display: 'flex', gap: 16, visibility: data ? 'visible' : 'hidden' }}>
        <strong style={{ flex: 1, maxWidth: 640 }}>{translate('discret.preview')}</strong>
        <strong style={{ paddingLeft: 12 }}>{translate('discret.class-bounds')}</strong>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', gap: 16, minHeight: 250 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {graphContent}
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#666', marginTop: 20, visibility: data ? 'visible' : 'hidden' }}>
            <span><svg width="20" height="12"><line x1="0" y1="6" x2="20" y2="6" stroke={MEAN_COLOR} strokeWidth="2.5" /></svg> {translate('discret.toggle.mean')}</span>
            <span><svg width="20" height="12"><line x1="0" y1="6" x2="20" y2="6" stroke={MEDIAN_COLOR} strokeWidth="2.5" /></svg> {translate('discret.toggle.median')}</span>
            <span><svg width="20" height="12"><line x1="0" y1="6" x2="20" y2="6" stroke={STDDEV_COLOR} strokeWidth="2.5" strokeDasharray="4,4" /></svg> {translate('discret.toggle.stddev')}</span>
          </div>
        </div>
        {data ? (
          <ClassifBornes breaksData={breaksData} />
        ) : (
          <div style={{ minWidth: 160 }} />
        )}
      </div>
      <div style={{ height: 48 }}>
        {data ? (
          <ClassifBucket
            breaksData={breaksData}
            entitiesByClass={data.entitiesByClass}
          />
        ) : (
          <div style={{ height: 48 }} />
        )}
      </div>
    </div>
  );
};

export default DiscretPreview;
