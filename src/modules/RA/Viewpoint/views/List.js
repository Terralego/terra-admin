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


const ListFilters = props => {
  const [selectInputs, setSelectInputs] = React.useState([]);

  const setFilters = async () => {
    const filterOptions = await fetchFilterOptions();
    const terraOppSearchableProperties = props.properties;

    const selectInputList = Object.keys(terraOppSearchableProperties).reduce(
      (filters, filterName) => {
        if (filterName in filterOptions) {
          const choices = filterOptions[filterName].map(value => ({ name: value, id: value }));
          if (terraOppSearchableProperties[filterName].type === 'many') {
            filters.push(
              <SelectArrayInput
                source={`properties__${terraOppSearchableProperties[filterName].json_key}`}
                label={terraOppSearchableProperties[filterName].json_key}
                choices={choices}
                key={terraOppSearchableProperties[filterName].json_key}
              />,
            );
          }
          if (terraOppSearchableProperties[filterName].type === 'single') {
            filters.push(
              <SelectInput
                source={`properties__${terraOppSearchableProperties[filterName].json_key}`}
                label={terraOppSearchableProperties[filterName].json_key}
                choices={choices}
                key={terraOppSearchableProperties[filterName].json_key}
              />,
            );
          }
        }
        return filters;
      }, [],
    );

    setSelectInputs(selectInputList);
  };

  React.useEffect(() => {
    setFilters();
  }, []);

  return (
    <Filter {...props}>
      <TextInput label="ra.action.search" source="search" alwaysOn />
      {selectInputs}
    </Filter>
  );
};

const ConnectedListFilters = connectAppProvider(({ env: { terraOppSearchableProperties } }) => ({
  properties: terraOppSearchableProperties,
}))(ListFilters);
export const ViewpointList = props => (
  <List
    {...props}
    exporter={false}
    filters={<ConnectedListFilters />}
    bulkActionButtons={<CommonBulkActionButtons />}
  >
    <GridList />
  </List>
);

export default ViewpointList;
