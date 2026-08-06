import React from 'react';
import { FilterList, FilterListItem } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import AssignmentIcon from '@material-ui/icons/Assignment';
import CategoryIcon from '@material-ui/icons/Category';
import StorageIcon from '@material-ui/icons/Storage';
import SyncIcon from '@material-ui/icons/Sync';
/* eslint-enable */

import FilterAside from '../../../../components/react-admin/FilterAside';

import {
  geomTypeChoices,
  reportStatusChoices,
  sourceStatusChoices,
  sourceTypeChoices,
} from '..';

/**
 * Filter query params, shared with the small-screen <Filter> in the list view
 * so both stay in sync.
 */
export const FILTER_SEARCH = 'search';
export const FILTER_TYPE = 'polymorphic_ctype__model';
export const FILTER_GEOM = 'geom_type';
export const FILTER_STATUS = 'status';
export const FILTER_REPORT_STATUS = 'report__status';

// The API matches the content type in lower case
const typeChoices = sourceTypeChoices.map(({ id, name }) => ({
  id: id.toLowerCase(),
  name,
}));

/**
 * Every filter of this list has a finite set of values, which is exactly what
 * <FilterList> is for — no autocomplete needed here, unlike the layer list.
 *
 * FilterListItem translates its label and falls back to the raw string, so
 * both the i18n keys of the status choices and the plain names of the geometry
 * choices go through unchanged.
 */
const ChoiceFilter = ({ label, icon, source, choices }) => (
  <FilterList label={label} icon={icon}>
    {choices.map(({ id, name }) => (
      <FilterListItem key={id} label={name} value={{ [source]: id }} />
    ))}
  </FilterList>
);

/**
 * The FilterList sidebar of the data source list, passed as the `aside` of
 * <List>. Hidden on extra small screens, where the list falls back to the
 * Filter Button/Form combo instead.
 */
export const ListAside = () => (
  <FilterAside search={FILTER_SEARCH}>
    <ChoiceFilter
      label="datasource.form.data-type"
      icon={<StorageIcon />}
      source={FILTER_TYPE}
      choices={typeChoices}
    />
    <ChoiceFilter
      label="datasource.form.geometry"
      icon={<CategoryIcon />}
      source={FILTER_GEOM}
      choices={geomTypeChoices}
    />
    <ChoiceFilter
      label="datasource.form.status"
      icon={<SyncIcon />}
      source={FILTER_STATUS}
      choices={sourceStatusChoices}
    />
    <ChoiceFilter
      label="datasource.form.report.title"
      icon={<AssignmentIcon />}
      source={FILTER_REPORT_STATUS}
      choices={reportStatusChoices}
    />
  </FilterAside>
);

export default ListAside;
