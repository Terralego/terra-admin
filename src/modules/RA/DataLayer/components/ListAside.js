import React from 'react';
import debounce from 'lodash.debounce';
import {
  FilterList,
  FilterListItem,
  useGetList,
  useGetOne,
  useListFilterContext,
  useTranslate,
} from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import CollectionsIcon from '@material-ui/icons/Collections';
import SearchIcon from '@material-ui/icons/Search';
import StorageIcon from '@material-ui/icons/Storage';
import TableChartIcon from '@material-ui/icons/TableChart';
import VisibilityIcon from '@material-ui/icons/Visibility';
/* eslint-enable */

import BooleanFilterList from '../../../../components/react-admin/BooleanFilterList';
import FilterAside from '../../../../components/react-admin/FilterAside';
import { RES_DATASOURCE, RES_VIEW } from '../../ra-modules';

/**
 * Filter query params, shared with the small-screen <Filter> in the list view
 * so both stay in sync.
 *
 * They must be flat: the data provider spreads `filter` into the query string
 * (`stringify(query)`), so a nested value would be serialized as
 * `popup_config=[object Object]`.
 */
export const FILTER_SEARCH = 'search';
export const FILTER_SOURCE = 'source';
export const FILTER_VIEW = 'group__view';
export const FILTER_ACTIVE_BY_DEFAULT = 'active_by_default';
export const FILTER_TABLE = 'table_enable';

// How many data sources the filter shows at once; the rest is reachable
// through its search box.
export const SOURCE_PAGE_SIZE = 8;

// Hoisted: useGetList keys its query on these, a new object on every render
// would refetch in a loop.
const VIEW_PAGINATION = { page: 1, perPage: 100 };
const SOURCE_PAGINATION = { page: 1, perPage: SOURCE_PAGE_SIZE };
const BY_NAME = { field: 'name', order: 'ASC' };
const NO_FILTER = {};

const useStyles = makeStyles({
  // Aligned on the FilterListItem gutters (see the RaFilterListItem override)
  sourceSearch: {
    paddingLeft: '2em',
    paddingRight: 48,
    paddingTop: 0,
  },
  sourceHint: {
    paddingLeft: '2em',
    paddingRight: 48,
    paddingTop: 0,
  },
});

/**
 * The selected source, rendered on its own so it stays visible — and
 * removable — even when it falls outside the current search results.
 */
const SelectedSource = ({ id }) => {
  const { data } = useGetOne(RES_DATASOURCE, id);

  if (!data) {
    return null;
  }

  return <FilterListItem label={data.name} value={{ [FILTER_SOURCE]: id }} />;
};

/**
 * Data sources are far too many to list, so this is a <FilterList> with a
 * search box on top: it shows the first SOURCE_PAGE_SIZE matches, server-side
 * filtered, and behaves like every other filter of the sidebar.
 */
const SourceFilter = () => {
  const classes = useStyles();
  const translate = useTranslate();
  const { filterValues } = useListFilterContext();
  // `text` drives the input, `query` the request — hence the two states
  const [text, setText] = React.useState('');
  const [query, setQuery] = React.useState('');

  const selectedId = filterValues[FILTER_SOURCE];

  const filter = React.useMemo(
    () => (query ? { [FILTER_SEARCH]: query } : NO_FILTER),
    [query],
  );

  const { data = {}, ids = [], total = 0 } = useGetList(
    RES_DATASOURCE,
    SOURCE_PAGINATION,
    BY_NAME,
    filter,
  );

  const search = React.useMemo(() => debounce(setQuery, 300), []);
  React.useEffect(() => () => search.cancel(), [search]);

  const handleChange = React.useCallback(value => {
    setText(value);
    search(value);
  }, [search]);

  const handleClear = React.useCallback(() => {
    setText('');
    search.cancel();
    setQuery('');
  }, [search]);

  const results = ids.filter(id => data[id] && id !== selectedId);
  const hidden = Math.max(0, total - ids.length);

  return (
    <FilterList label="datalayer.form.data-source" icon={<StorageIcon />}>
      <ListItem className={classes.sourceSearch} disableGutters>
        <TextField
          fullWidth
          margin="dense"
          value={text}
          placeholder={translate('ra.action.search')}
          onChange={event => handleChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="disabled" />
              </InputAdornment>
            ),
            endAdornment: !!text && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label={translate('ra.action.clear_input_value')}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ListItem>

      {selectedId !== undefined && <SelectedSource id={selectedId} />}

      {results.map(id => (
        <FilterListItem
          key={id}
          label={data[id].name}
          value={{ [FILTER_SOURCE]: id }}
        />
      ))}

      {hidden > 0 && (
        <ListItem className={classes.sourceHint} disableGutters>
          <Typography variant="caption" color="textSecondary">
            {translate('datalayer.filters.refine', { smart_count: hidden })}
          </Typography>
        </ListItem>
      )}
    </FilterList>
  );
};

/**
 * Views are few and named, so the whole list is fetched once.
 */
const ViewFilter = () => {
  const { data = {}, ids = [], loaded } = useGetList(
    RES_VIEW,
    VIEW_PAGINATION,
    BY_NAME,
    NO_FILTER,
  );

  if (!loaded || !ids.length) {
    return null;
  }

  return (
    <FilterList label="datalayer.form.view" icon={<CollectionsIcon />}>
      {ids.map(id => (
        <FilterListItem
          key={id}
          label={data[id].name}
          value={{ [FILTER_VIEW]: id }}
        />
      ))}
    </FilterList>
  );
};

/**
 * The FilterList sidebar of the layer list, passed as the `aside` of <List>.
 * Hidden on extra small screens, where the list falls back to the Filter
 * Button/Form combo instead.
 */
export const ListAside = () => (
  <FilterAside search={FILTER_SEARCH}>
    <SourceFilter />
    <ViewFilter />
    <BooleanFilterList
      label="datalayer.filters.active_by_default"
      icon={<VisibilityIcon />}
      source={FILTER_ACTIVE_BY_DEFAULT}
    />
    <BooleanFilterList
      label="datalayer.filters.table"
      icon={<TableChartIcon />}
      source={FILTER_TABLE}
    />
  </FilterAside>
);

export default ListAside;
