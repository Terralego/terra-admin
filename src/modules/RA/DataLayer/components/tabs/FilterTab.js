import React from 'react';

import {
  TextInput,
  BooleanInput,
  SelectInput,
  ArrayInput,
  FormDataConsumer,
} from 'react-admin';


import DraggableFormIterator from '../../../../../components/react-admin/DraggableFormIterator';


import { required } from '../../../../../utils/react-admin/validate';
import TextArrayInput from '../../../../../components/react-admin/TextArrayInput';


const defaultRequired = required();

const FilterTab = () => (
  <ArrayInput source="fields" label="datalayer.form.filter.all-fields-available" fullWidth>
    <DraggableFormIterator
      disableAdd
      disableRemove
    >
      <FormDataConsumer>
        {({ scopedFormData = {}, getSource }) => (
          <TextInput multiline source={getSource('label')} label={scopedFormData.name} fullWidth />
        )}
      </FormDataConsumer>
      <BooleanInput
        source="filter_enable"
        label="datalayer.form.filter.allow-filtering-field"
        fullWidth
      />
      <FormDataConsumer>
        {({
          scopedFormData: {
            filter_enable: filterEnable,
            filter_settings: { type: filterType, fetchValues: filterFetch } = {},
          } = {},
          getSource,
        }) => {
          if (!filterEnable) return null;

          return (
            <>
              <SelectInput
                source={getSource('filter_settings.type')}
                choices={[
                  { id: 'single', name: 'datalayer.form.filter.type.single' },
                  { id: 'many', name: 'datalayer.form.filter.type.many' },
                  { id: 'range', name: 'datalayer.form.filter.type.range' },
                ]}
                label="datalayer.form.type.label"
                validate={defaultRequired}
              />
              {filterType && (
                <BooleanInput
                  source={getSource('filter_settings.fetchValues')}
                  label="datalayer.form.filter.type.fetch.label"
                  fullWidth
                />
              )}
              {(filterType && !filterFetch) && (
                <TextArrayInput
                  source={getSource('filter_settings.values')}
                  label={`datalayer.form.filter.type.values${filterType === 'many' ? '' : '_optional'}`}
                  validate={filterType === 'many' ? defaultRequired : undefined}
                  fullWidth
                />
              )}
              {filterType === 'range' && (
                <SelectInput
                  source={getSource('filter_settings.format')}
                  label="datalayer.form.filter.type.range_format.label"
                  choices={[
                    { id: 'number', name: 'datalayer.form.filter.type.range_format.number' },
                    { id: 'date', name: 'datalayer.form.filter.type.range_format.date' },
                  ]}
                />
              )}
            </>
          );
        }}
      </FormDataConsumer>
    </DraggableFormIterator>
  </ArrayInput>

);

export default FilterTab;
