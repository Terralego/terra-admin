import React from 'react';
import debounce from 'lodash.debounce';
import { useDataProvider, useTranslate } from 'react-admin';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import { RES_DATASOURCE } from '../../../../ra-modules';
import { entityLabel, fetchEntities } from './preview/sourceEntities';

/** No entity picked: the preview shows the minisheet with no data. */
export const NO_ENTITY = { properties: {} };

/** Slug of the source, which names its layer in the API of the entities. */
export const useSourceSlug = sourceId => {
  const dataProvider = useDataProvider();
  const [loaded, setLoaded] = React.useState({});

  React.useEffect(() => {
    if (!sourceId) {
      return undefined;
    }
    let cancelled = false;
    dataProvider.getOne(RES_DATASOURCE, { id: sourceId })
      .then(({ data }) => data?.slug ?? null)
      .catch(() => null)
      .then(slug => {
        if (!cancelled) setLoaded({ sourceId, slug });
        return slug;
      });
    return () => { cancelled = true; };
  }, [dataProvider, sourceId]);

  if (!sourceId) {
    return null;
  }
  return loaded.sourceId === sourceId ? loaded.slug : undefined;
};

/**
 * Loads the first entity of the source when none is picked yet: the preview
 * shows it by default. No entity, or no answer: null.
 */
export const useDefaultEntity = (slug, entity, setEntity) => {
  React.useEffect(() => {
    if (!slug || entity !== undefined) {
      return undefined;
    }
    let cancelled = false;
    fetchEntities(slug, { limit: 1 })
      .then(([first]) => first ?? null)
      .catch(() => null)
      .then(first => {
        if (!cancelled) setEntity(first);
        return first;
      });
    return () => { cancelled = true; };
  }, [slug, entity, setEntity]);
};

/**
 * Picks the entity of the source shown by the preview, by a search on the
 * source. Cleared, the preview shows the minisheet with no data.
 */
export const EntityPicker = ({ slug, entity, setEntity, titleField }) => {
  const translate = useTranslate();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [query, setQuery] = React.useState('');
  const sendQuery = React.useMemo(() => debounce(setQuery, 300), []);
  React.useEffect(() => () => sendQuery.cancel(), [sendQuery]);
  const [found, setFound] = React.useState({ results: [] });
  const searchKey = `${slug}\n${query}`;

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }
    let cancelled = false;
    fetchEntities(slug, { search: query })
      .catch(() => [])
      .then(results => {
        if (!cancelled) setFound({ key: searchKey, results });
        return results;
      });
    return () => { cancelled = true; };
  }, [open, slug, query, searchKey]);

  const loading = open && (found.key !== searchKey || search !== query);
  const options = found.key === searchKey ? found.results : [];

  const label = option => entityLabel(option, titleField);

  return (
    <Autocomplete
      size="small"
      fullWidth
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={entity && entity !== NO_ENTITY ? entity : null}
      onChange={(event, value) => setEntity(value ?? NO_ENTITY)}
      onInputChange={(event, value, reason) => {
        if (reason === 'input' || reason === 'clear') {
          setSearch(value);
          sendQuery(value);
        }
      }}
      options={options}
      filterOptions={x => x}
      getOptionLabel={label}
      isOptionEqualToValue={(option, value) => option.identifier === value.identifier}
      loading={loading}
      loadingText={translate('datalayer.form.minisheet.preview.entity-loading')}
      noOptionsText={translate('datalayer.form.minisheet.preview.entity-none')}
      renderOption={({ key, ...props }, option) => (
        <Box component="li" key={option.identifier} {...props} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <span>{label(option)}</span>
          {label(option) !== `${option.identifier}` && (
            <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>{option.identifier}</Box>
          )}
        </Box>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label={translate('datalayer.form.minisheet.preview.entity')}
          slotProps={{
            inputLabel: { ...params.InputLabelProps, shrink: true },
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={16} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default EntityPicker;
