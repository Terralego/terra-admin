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
  const [themes, setThemes] = React.useState([]);

  const setFiltersNames = async () => {
    const data = await fetchFilterOptions();
    const cities = data.cities.map(city => ({name: city, id: city}));
    const themes = data.themes.map(theme => ({name: theme, id: theme}));

    setCities(cities);
    setThemes(themes);
  };

  React.useEffect(() => {
    setFiltersNames();
  }, []);

  return (
    <Filter {...props}>
      <TextInput label="ra.action.search" source="search" alwaysOn />
      <SelectInput
        source="commune"
        label="commune"
        choices={cities}
      />
      <SelectInput
        source="themes"
        label="themes"
        choices={themes}
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
