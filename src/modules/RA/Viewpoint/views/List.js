import React from 'react';
import {
  Filter,
  List,
  SelectArrayInput,
  SelectInput,
  TextInput,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';
import { fetchFilterOptions } from '../../ra-modules';
import { connectAppProvider } from '../../../../components/AppProvider';


const ListFilters = ({ terraOppSearchableProperties, ...props }) => {
  const [filters, setFilters] = React.useState([]);

  const setFiltersList = async () => {
    const filterOptions = await fetchFilterOptions();

    /*
      To generate the select input list to render, first check that the filters in props.properties
      are also set in the retrieved filter options from the backend. After that we can generate the
      corresponding choices list to each select and generate its properties to be used on render.
     */
    const filterList = Object.keys(terraOppSearchableProperties).reduce(
      (filtersList, filterName) => {
        if (filterName in filterOptions) {
          filtersList.push({
            choices: filterOptions[filterName].map(value => ({ name: value, id: value })),
            type: terraOppSearchableProperties[filterName].type,
            source: `properties__${terraOppSearchableProperties[filterName].json_key}`,
            label: terraOppSearchableProperties[filterName].json_key,
          });
        }
        return filtersList;
      }, [],
    );

    setFilters(filterList);
  };

  React.useEffect(() => {
    setFiltersList();
  }, []);

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

const ListFiltersConnected = withTerraOppSearchableProperties(ListFilters);

export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ListFiltersConnected />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
