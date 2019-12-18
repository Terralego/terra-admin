import React from 'react';
import {
  Filter,
  List,
  SelectInput,
  TextInput,
} from 'react-admin';

import CommonBulkActionButtons from '../../../../components/react-admin/CommonBulkActionButtons';
import GridList from '../../../../components/react-admin/GridList';
import {fetchFilterOptions} from "../../ra-modules";


const ListFilters = props => {
  const [cities, setCities] = React.useState([]);

  const setCitiesNames = async () => {
    const data = await fetchFilterOptions();
    const citiesNames = data.cities.map(city => ({name: city, id: city}));

    setCities({
      names: citiesNames,
    });
  };

  React.useEffect(() => {
    setCitiesNames();
  }, []);

  return (
    <Filter {...props}>
      <TextInput label="ra.action.search" source="search" alwaysOn />
      <SelectInput
        source="commune"
        label="commune"
        choices={cities.names}
      />
    </Filter>
  );
};

export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
