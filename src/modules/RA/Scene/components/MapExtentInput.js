import React, { useCallback, useMemo, useState } from 'react';

import { useTranslate } from 'react-admin';
import { useField, useForm } from 'react-final-form';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import BboxInput from './extents/BboxInput';
import ExtentList from './extents/ExtentList';
import ExtentMap from './extents/ExtentMap';
import ExtentModeSelector from './extents/ExtentModeSelector';
import ExtentPicker from './extents/ExtentPicker';
import ExtentPreview from './extents/ExtentPreview';
import useExtentCatalogue from './extents/useExtentCatalogue';
import {
  EXTENTS_PATH,
  SINGLE,
  getExtentType,
  getFitBoundsBbox,
  moveExtent,
  normalizeExtents,
  toFitBounds,
  validateExtraExtents,
} from './extents/utils';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  list: {
    flex: '1 1 240px',
    minWidth: 240,
  },
  editor: {
    flex: '2 1 340px',
    minWidth: 320,
  },
  standalone: {
    maxWidth: 600,
    marginBottom: theme.spacing(2),
  },
  add: {
    marginTop: '.5em',
  },
}));

const MapExtentInput = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const form = useForm();
  const { extents: catalogue, byId, loading } = useExtentCatalogue();

  const identity = useCallback(value => value, []);
  const {
    input: { value: mapSettings },
  } = useField('config.map_settings', { format: identity, parse: identity });
  const {
    input: { value: rawIds },
  } = useField(EXTENTS_PATH, {
    validate: validateExtraExtents,
    format: identity,
    parse: identity,
  });

  const mode = getExtentType(mapSettings);
  const ids = useMemo(() => normalizeExtents(rawIds), [rawIds]);
  const singleBbox = useMemo(() => getFitBoundsBbox(mapSettings), [mapSettings]);

  const [wantedIndex, setWantedIndex] = useState(0);
  const selectedIndex = Math.min(wantedIndex, ids.length - 1);
  const selectedId = ids[selectedIndex];

  const commit = useCallback(next => form.change(EXTENTS_PATH, next), [form]);

  const handleMode = useCallback(next => {
    form.change('config.map_settings.extent_type', next);
  }, [form]);

  const handleDraw = useCallback(bbox => {
    form.change('config.map_settings.fitBounds', toFitBounds(bbox));
  }, [form]);

  const handleAdd = useCallback(({ id }) => {
    commit([...ids, id]);
    setWantedIndex(ids.length);
  }, [commit, ids]);

  const handleAddMany = useCallback(added => {
    const missing = added.map(({ id }) => id).filter(id => !ids.includes(id));
    if (!missing.length) return;

    commit([...ids, ...missing]);
    setWantedIndex(ids.length);
  }, [commit, ids]);

  const handleDelete = useCallback(() => {
    commit(ids.filter((current, index) => index !== selectedIndex));
    setWantedIndex(Math.max(0, selectedIndex - 1));
  }, [commit, ids, selectedIndex]);

  const handleMove = useCallback(to => {
    commit(moveExtent(ids, selectedIndex, to));
    setWantedIndex(to);
  }, [commit, ids, selectedIndex]);

  return (
    <Box>
      <Typography variant="body1">{translate('view.form.extent-label')}</Typography>

      <ExtentModeSelector mode={mode} onChange={handleMode} />

      {mode === SINGLE ? (
        <div className={classes.standalone}>
          <ExtentMap bbox={singleBbox} onChange={handleDraw} />
          <BboxInput bbox={singleBbox} onChange={handleDraw} />
        </div>
      ) : (
        <div className={classes.root}>
          <div className={classes.list}>
            <ExtentList
              ids={ids}
              byId={byId}
              selectedIndex={selectedIndex}
              onSelect={setWantedIndex}
            />
            <div className={classes.add}>
              <ExtentPicker
                catalogue={catalogue}
                usedIds={ids}
                loading={loading}
                onPick={handleAdd}
                onPickMany={handleAddMany}
              />
            </div>
          </div>
          <div className={classes.editor}>
            {selectedId !== undefined ? (
              <ExtentPreview
                id={selectedId}
                extent={byId(selectedId)}
                index={selectedIndex}
                count={ids.length}
                onMove={handleMove}
                onDelete={handleDelete}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                {translate('view.form.extent.empty')}
              </Typography>
            )}
          </div>
        </div>
      )}
    </Box>
  );
};

export default MapExtentInput;
