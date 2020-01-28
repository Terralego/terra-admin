import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Icon, InputGroup, Spinner } from '@blueprintjs/core';
import './styles.scss';

const CustomLoader = ({ isSearching }) => (
  isSearching
    ? <Spinner size={Icon.SIZE_STANDARD} />
    : <div style={{ width: 30 }} />
);

const Search = ({
  featureEndpoint,
  featuresList,
  getFeaturesList,
  setTableFilters,
  t,
  tableFilters,
}) => {
  const { search: defaultValue } = tableFilters;
  const inputRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
    setIsSearching(false);
  }, [featuresList]);

  const loadData = async value => {
    const querystring = { ...tableFilters, page: 1, search: value };
    await getFeaturesList(featureEndpoint, querystring);
    setTableFilters(querystring);
  };

  const delayedQuery = useRef(
    debounce(value => {
      if (!value.length || value.length > 2) {
        setIsSearching(true);
        if (featureEndpoint) {
          loadData(value);
        }
      }
    },
    500),
  ).current;

  const onChange = ({ target: { value } }) => {
    delayedQuery(value);
  };

  return (
    <InputGroup
      defaultValue={defaultValue}
      inputRef={inputRef}
      onChange={onChange}
      minimal
      leftIcon="search"
      rightElement={<CustomLoader isSearching={isSearching} />}
      disabled={isSearching}
      title={t('CRUD.table.search')}
      type="search"
    />
  );
};

Search.propTypes = {
  featureEndpoint: PropTypes.string,
  featuresList: PropTypes.shape({}),
  getFeaturesList: PropTypes.func,
  setTableFilters: PropTypes.func,
  t: PropTypes.func,
  tableFilters: PropTypes.shape({}),
};

Search.defaultProps = {
  featureEndpoint: undefined,
  featuresList: {},
  getFeaturesList: () => {},
  setTableFilters: () => {},
  t: () => {},
  tableFilters: {},
};

export default Search;
