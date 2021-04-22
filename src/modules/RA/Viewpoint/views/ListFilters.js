import React from 'react';
import { Filter, SelectArrayInput, SelectInput, TextInput, ReferenceInput } from 'react-admin';
import { ISODateFormat } from '../../../../utils/date';

import { fetchFilterOptions } from '../../ra-modules';

import useAppSettings from '../../../../hooks/useAppSettings';

/*
  To generate the select input props list, first check that the filters in filterList are also
  set in filterOptions. After that we can generate the corresponding choices list to each select
  and generate its properties to be used on render.
*/
const reduceFilters = filterOptions => (filterList, [filterName, filterProps]) => {
  const options = filterOptions[filterName];

  if (!options) {
    // Case filter without choice list
    return [
      ...filterList,
      {
        ...filterProps,
        source: `properties__${filterProps.json_key}`,
        label: `resources.viewpoint.fields.properties.${filterProps.json_key}`,
      },
    ];
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

const moreXYears = x =>
  ISODateFormat(new Date(new Date().setFullYear(new Date().getFullYear() - x)));

export const lastPictureChoices = [
  { id: moreXYears(1), name: 'resources.viewpoint.filters.more-1-year' },
  { id: moreXYears(2), name: 'resources.viewpoint.filters.more-2-year' },
  { id: moreXYears(3), name: 'resources.viewpoint.filters.more-3-year' },
  { id: moreXYears(5), name: 'resources.viewpoint.filters.more-5-year' },
];

export const ListFilters = props => {
  const settings = useAppSettings();
  const terraOppSearchableProperties = settings.modules.OPP.searchable_properties;

  const [filters, setFilters] = React.useState([]);

  React.useEffect(() => {
    let isMounted = true;

    const setFiltersList = async () => {
      const filterOptions = await fetchFilterOptions();

      if (!isMounted) return;

      const newFilters = Object.entries(terraOppSearchableProperties).reduce(
        reduceFilters(filterOptions),
        [],
      );
      setFilters(newFilters);
    };

    if (terraOppSearchableProperties) {
      setFiltersList();
    }

    return () => {
      isMounted = false;
    };
  }, [terraOppSearchableProperties]);

  return (
    <Filter {...props}>
      <TextInput label="ra.action.search" source="search" alwaysOn />
      <ReferenceInput
        label="resources.viewpoint.fields.city"
        source="city_id"
        reference="city"
        allowEmpty
      >
        <SelectInput optionText="label" />
      </ReferenceInput>
      <SelectInput
        label="resources.viewpoint.fields.last_accepted_picture_date"
        source="last_picture"
        choices={lastPictureChoices}
        style={{ width: '15em' }}
      />
      {filters.map(({ type, ...filterProps }) => {
        let SelectComponent = TextInput;
        switch (type) {
          case 'many':
            SelectComponent = SelectArrayInput;
            break;
          case 'select':
            SelectComponent = SelectInput;
            break;
          default:
        }

        return <SelectComponent {...filterProps} key={filterProps.label} />;
      })}
    </Filter>
  );
};

export default ListFilters;
