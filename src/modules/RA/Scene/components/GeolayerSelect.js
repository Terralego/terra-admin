import React from 'react';

import { LinearProgress, withDataProvider, GET_LIST } from 'react-admin';

import debounce from 'lodash.debounce';
import uniqBy from 'lodash.uniqby';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

import { RES_DATALAYER } from '../../ra-modules';

const sanitizeRestProps = ({
  dispatch,
  ...rest
}) => rest;

const PER_PAGE = 100;
const MAX_NON_NATIVE_SELECT = 500;

/**
 * Get all layers accross pagination.
 * @param {*} dataProvider The dataproviver instance
 * @param {*} filter optionnal filter
 */
const getAllPaginatedLayer = async (dataProvider, mounted, filter = {}) => {
  /**
   * Generate the dataProvider query.
   * @param {int} page to retreive.
   */
  const genLayerQuery = page => ({
    pagination: { page, perPage: PER_PAGE },
    sort: { field: 'name', order: 'ASC' },
    filter,
  });

  // Get first layer to know total
  const { total, data: dataFirstPage } =
    await dataProvider(GET_LIST, RES_DATALAYER, genLayerQuery(1));

  const pageCount = Math.ceil(total / PER_PAGE);

  // Launch query for all next pages
  const promises = Array.from({ length: pageCount - 1 }, async (_, index) => {
    const { data } = await dataProvider(GET_LIST, RES_DATALAYER, genLayerQuery(index + 2));
    return data;
  });

  if (!mounted.current) return [];

  const result = [
    dataFirstPage,
    ...(await Promise.all(promises)),
  ];

  // We need uniqBy here as the back send many times the same layer
  // as order by name fails on some instance with lot of element with same name
  // We should find another way to order. (Id ?).
  return uniqBy(result.flat(1), ({ id }) => id);
};

const GeolayerSelect = ({ dataProvider, onChange, excludeIds = [], includeIds = [], ...props }) => {
  const [geolayers, setGeolayers] = React.useState(null);

  const handleChoice = ({ target: { value } }) =>
    onChange({
      geolayer: Number(value),
      label: geolayers.find(({ id }) => (Number(value) === id)).name,
    });

  React.useEffect(() => {
    const mounted = { current: true };

    const getGeolayers = debounce(async () => {
      /**
       * Get geolayers from API
       */

      const allLayers = await getAllPaginatedLayer(dataProvider, mounted);

      /**
       * Do not set state if component is unmounted
       */
      if (!mounted.current) {
        return;
      }

      /**
       * Store geolayers into state with only name & id props
       */
      setGeolayers(allLayers
        .filter(({ view, id }) => {
          // Include layers that have just been removed from tree
          if (includeIds.includes(id)) {
            return true;
          }

          // Exclude layers already owned by a view, or already in current tree
          if (view || excludeIds.includes(id)) {
            return false;
          }

          return true;
        })
        .map(({ name, id }) => ({ name, id })));
    }, 300);

    getGeolayers();

    /**
     * Cleanup function
     */
    return () => { mounted.current = false; };
  }, [dataProvider, excludeIds, includeIds]);

  /**
   * Display progress bar until we have geolayers
   */
  if (!geolayers) {
    return <LinearProgress />;
  }

  if (!geolayers.length) {
    return (
      <div>
        Toutes les couches existantes sont déjà associées.
      </div>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="geolayer">Couche</InputLabel>

      {/* Do we have too many element to have perf issues ? */}
      { (geolayers.length > MAX_NON_NATIVE_SELECT) && (
      <NativeSelect onChange={handleChoice} {...sanitizeRestProps(props)} name="geolayer">
        {geolayers.map(({ id, name }) => (
          <option key={id} value={id}>{name} ({id})</option>
        ))}
      </NativeSelect>
      )}

      { (geolayers.length <= MAX_NON_NATIVE_SELECT) && (
      <Select onChange={handleChoice} {...sanitizeRestProps(props)} name="geolayer">
        {geolayers.map(({ id, name }) => (
          <MenuItem key={id} value={id}>{name} ({id})</MenuItem>
        ))}
      </Select>
      )}

    </FormControl>
  );
};

export default withDataProvider(GeolayerSelect);
