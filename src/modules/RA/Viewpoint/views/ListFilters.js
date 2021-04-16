import React from 'react';
import { Filter, SelectArrayInput, SelectInput, TextInput } from 'react-admin';

import { fetchFilterOptions } from '../../ra-modules';
import { connectAppProvider } from '../../../../components/AppProvider';


/*
  To generate the select input props list, first check that the filters in filterList are also
  set in filterOptions. After that we can generate the corresponding choices list to each select
  and generate its properties to be used on render.
*/
const reduceFilters = filterOptions => (filterList, [filterName, filterProps]) => {
  const options = filterOptions[filterName];

  if (!options) {
    return filterList;
  }

  return [
    ...filterList,
    {
      choices: options.map(option => ({ name: option, id: option })),
      type: filterProps.type,
      source: `properties__${filterProps.json_key}`,
      label: filterProps.json_key,
    },
  ];
};

export const ListFilters = ({ terraOppSearchableProperties, ...props }) => {
  const [filters, setFilters] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;

    const setFiltersList = async () => {
      const filterOptions = await fetchFilterOptions();
      console.log('filt', filterOptions);

      if (!isMounted) return;

      const newFilters = Object.entries(terraOppSearchableProperties)
        .reduce(reduceFilters(filterOptions), []);
      setFilters(newFilters);
    };

    if (terraOppSearchableProperties) {
      setFiltersList();
    }

    return () => { isMounted = false; };
  }, [terraOppSearchableProperties]);

  console.log('yeah');

  return (
    <Filter {...props}>
      <TextInput label="ra.action.search" source="search" alwaysOn />
      {filters.map(({ type, ...filterProps }) => {
        const SelectComponent = type === 'many'
          ? SelectArrayInput
          : SelectInput;

        return (
          <SelectComponent
            {...filterProps}
            key={filterProps.label}
          />
        );
      })}
    </Filter>
  );
};

const withTerraOppSearchableProperties = WrappedComponent => (
  connectAppProvider(({ env: { terraOppSearchableProperties } }) => (
    { terraOppSearchableProperties }
  ))(WrappedComponent)
);

export default withTerraOppSearchableProperties(ListFilters);
