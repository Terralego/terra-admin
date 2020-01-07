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
import {fetchFilterOptions} from "../../ra-modules";
import {connectAppProvider} from "../../../../components/AppProvider";


const ListFilters = props => {
  const [selectInputs, setSelectInputs] = React.useState([]);

  const setFilters = async () => {
    const filterOptions = await fetchFilterOptions();
    const multiSelect = filterOptions.many;
    delete filterOptions.many;

    let selectInputList = [];

    const terraOppSearchableProperties = props.properties;

    Object.keys(filterOptions).forEach(key => {
      let choices = filterOptions[key].map((value) => ({name: value, id: value}));
      let selectInput = [];
      // FIXME key pas bonne
      if (multiSelect.includes(key)) {
        selectInput = (
          <SelectArrayInput
            source={"properties__" + key}
            label={key}
            choices={choices}
          />
        );
      } else {
        selectInput = (
          <SelectInput
            source={"properties__" + key}
            label={key}
            choices={choices}
          />
        );
      }
      selectInputList.push(selectInput);
    });

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

const ConnectedListFilters = connectAppProvider(({env: {terraOppSearchableProperties}}) => ({
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
