import React from 'react';

import {
  useTranslate,
} from 'react-admin';

import Typography from '@material-ui/core/Typography';

import { useField, useForm } from 'react-final-form';
import Placeholder from '../../../../../../components/Placeholder';


import AddFilter from './AddFilter';
import FieldsConfigList from './FieldsConfigList';

/**
 * Filter enabled fields by order or index
 * @param {array} fields
 */
const orderFilterFields = fields =>
  fields.filter(({ filter_enable: filterEnable }) => filterEnable) // Filter only enabled fields
    .map((field, index) =>
      [field?.filter_settings.order, index, field]) // eslint-disable-line camelcase
    .sort(([ordera, indexa], [orderb, indexb]) => {
      if (ordera !== undefined && orderb === undefined) {
        return -1;
      }
      if (ordera === undefined && orderb !== undefined) {
        return 1;
      }
      if (ordera !== undefined && orderb !== undefined) {
        return ordera - orderb;
      }
      return indexa - indexb;
    }).map(([,, field], index) => {
      // eslint-disable-next-line camelcase
      if (field?.filter_settings.order !== undefined) {
        return field;
      }
      // eslint-disable-next-line no-param-reassign
      field.filter_settings.order = index;
      return field;
    });

const FilterTab = () => {
  const translate = useTranslate();
  const { input: { value: fields } } = useField('fields');
  const form = useForm();

  const handleSortEnd = React.useCallback(({ oldIndex, newIndex }) => {
    const { values: { fields: formFields } } = form.getState();
    if (oldIndex !== newIndex) {
      const newFields = [...formFields];

      const sortedFields = orderFilterFields(newFields);
      sortedFields.splice(newIndex, 0, sortedFields.splice(oldIndex, 1)[0]);

      sortedFields.forEach((field, index) => {
        // eslint-disable-next-line camelcase
        // eslint-disable-next-line no-param-reassign
        field.filter_settings.order = index;
      });
      form.change('fields', newFields);
    }
  }, [form]);

  const sortedFields = React.useMemo(
    () =>
      orderFilterFields(fields),
    [fields],
  );

  // No field for this source
  if (fields.length === 0) {
    return (
      <Placeholder>
        <Typography variant="h5" component="h2">{translate('datalayer.form.filter.no-field')}</Typography>
      </Placeholder>
    );
  }

  // No active filter
  if (sortedFields.length === 0) {
    return (
      <Placeholder>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" style={{ paddingBottom: '1em' }}>{translate('datalayer.form.filter.no-filter')}</Typography>
          <AddFilter fields={fields} />
        </div>
      </Placeholder>
    );
  }

  return (
    <>
      <Typography variant="h5" component="h2">{translate('datalayer.form.filter.title')}</Typography>
      <FieldsConfigList
        filters={sortedFields}
        onSortEnd={handleSortEnd}
        useDragHandle
        lockAxis="y"
      />
      <AddFilter fields={fields} />
    </>
  );
};

export default FilterTab;
