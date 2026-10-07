import React from 'react';

/**
 * Page title for a record view, to be passed as the `title` of <Edit>/<Show>.
 *
 * react-admin defaults to `ra.page.edit` ("Couche #12"); this shows the record
 * own name instead. <Title> clones the element with the current `record`, which
 * is undefined while loading — hence the empty fallback.
 *
 * @param {string} source the record field holding its name (default `name`)
 */
export const RecordTitle = ({ record, source = 'name' }) => (
  <span>{(record && record[source]) || ''}</span>
);

export default RecordTitle;
