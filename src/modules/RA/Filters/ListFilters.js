import React from 'react';
import { Filter, SelectArrayInput, SelectInput, TextInput } from 'react-admin';

import { fetchFilterOptions } from '../ra-modules';
import { connectAppProvider } from '../../../components/AppProvider';


export const ListFilters = ({ terraOppSearchableProperties, ...props }) => {
  const [filters, setFilters] = React.useState([]);

  const reduceFilters = (filterList, filterOptions) => (
    /*
      To generate the select input props list, first check that the filters in filterList are also
      set in filterOptions. After that we can generate the corresponding choices list to each select
      and generate its properties to be used on render.
    */
    Object.entries(filterList).reduce(
      (reducedFilterList, [filterName, filterProps]) => {
        if (filterName in filterOptions) {
          reducedFilterList.push({
            choices: filterOptions[filterName].map(value => ({ name: value, id: value })),
            type: filterProps.type,
            source: `properties__${filterProps.json_key}`,
            label: filterProps.json_key,
          });
        }
        return reducedFilterList;
      }, [],
    )
  );

  React.useEffect(() => {
    const setFiltersList = async () => {
      const filterOptions = await fetchFilterOptions();
      setFilters(reduceFilters(terraOppSearchableProperties, filterOptions));
    };

    setFiltersList();
  }, [terraOppSearchableProperties]);

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
