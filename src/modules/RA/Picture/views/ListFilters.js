import React from 'react';
import { Filter, TextInput } from 'react-admin';

export const ListFilters = props => (
  <Filter {...props}>
    <TextInput label="ra.action.search" source="search" alwaysOn />
  </Filter>
);

export default ListFilters;
