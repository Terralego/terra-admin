import React from 'react';

import { LinearProgress, withDataProvider, GET_LIST } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
/* eslint-enable */

import { RES_DATALAYER } from '../../ra-modules';

const sanitizeRestProps = ({
  dispatch,
  ...rest
}) => rest;

const GeolayerSelect = ({ dataProvider, onChange, ...props }) => {
  const [geolayers, setGeolayers] = React.useState(null);

  const handleChoice = ({ target: { value } }) =>
    onChange({
      geolayer: value,
      title: geolayers.find(({ id }) => (value === id)).name,
    });

  React.useEffect(() => {
    let mounted = true;

    const getGeolayers = async () => {
      /**
       * Get geolayers from API
       */
      const { data } = await dataProvider(GET_LIST, RES_DATALAYER, {
        pagination: { page: 1, perPage: 999 },
        sort: { field: 'name', order: 'ASC' },
        filter: {},
      });

      /**
       * Do not set state if component is unmounted
       */
      if (!mounted) {
        return;
      }

      /**
       * Store geolayers into state with only name & id props
       */
      setGeolayers(data
        .filter(({ group }) => !group)
        .map(({ name, id }) => ({ name, id })));
    };

    getGeolayers();

    /**
     * Cleanup function
     */
    return () => { mounted = false; };
  }, [dataProvider]);

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
      <Select onChange={handleChoice} {...sanitizeRestProps(props)} name="geolayer">
        {geolayers.map(({ id, name }) => (
          <MenuItem key={id} value={id}>{name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default withDataProvider(GeolayerSelect);
