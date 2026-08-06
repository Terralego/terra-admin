import React from 'react';
import { FilterList, FilterListItem } from 'react-admin';

// Named so the JSX reads as data, not as boolean JSX attributes
const ENABLED = true;
const DISABLED = false;

/**
 * A <FilterList> for a boolean field: one entry per state.
 *
 * Both entries share the same filter key, so picking one unpicks the other —
 * that is the plain <FilterListItem> behaviour.
 *
 * @param {string} label i18n key of the section
 * @param {ReactNode} icon icon of the section
 * @param {string} source the filter query param
 */
export const BooleanFilterList = ({ label, icon, source }) => (
  <FilterList label={label} icon={icon}>
    <FilterListItem label="ra.boolean.true" value={{ [source]: ENABLED }} />
    <FilterListItem label="ra.boolean.false" value={{ [source]: DISABLED }} />
  </FilterList>
);

export default BooleanFilterList;
