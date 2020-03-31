import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import uuid from 'uuid/v4';

import { getObjectOrderedValue } from '../../../../modules/CRUD/services/utils';
import Field from  '../Field';

const Tbody = ({
  disabled,
  formData,
  onChange,
  registry,
  schema: {
    items: {
      properties,
      required,
    },
  },
  uiSchema: {
    items: uiSchemaItems,
  },
}) => {
  const [data, setData] = useState(formData);

  useEffect(() => {
    onChange(data);
  }, [data, onChange]);

  const handleChange = useCallback((row, key) => value => {
    const nextData = [...data];
    nextData[row][key] = value;
    onChange(nextData);
  }, [data, onChange]);

  const orderedValues = useMemo(() => (
    getObjectOrderedValue(properties, uiSchemaItems['ui:order'])
  ), [properties, uiSchemaItems]);

  const handleUpdatingRow = useCallback((index, action) => {
    setData(prevData => {
      const cloneData = [...prevData];
      if (action === 'inserting') {
        const emptyRow = Object.keys(orderedValues).reduce((list, key) => ({
          ...list, [key]: undefined,
        }), {});
        cloneData.splice(index, 0, emptyRow);
      }
      if (action === 'removing') {
        cloneData.splice(index, 1);
      }
      if (action === 'moving-up') {
        cloneData.splice(index - 1, 0, cloneData.splice(index, 1)[0]);
      }
      if (action === 'moving-down') {
        cloneData.splice(index + 1, 0, cloneData.splice(index, 1)[0]);
      }
      return cloneData;
    });
  }, [orderedValues]);


  if (!data.length) {
    handleUpdatingRow(0, 'inserting');
  }

  return (
    <tbody>
      {data.map((item, index) => (
        <tr key={uuid()} className="tableField__tr">
          {Object.keys(orderedValues).map(key => (
            <td className="tableField__td" key={key}>
              <Field
                disabled={disabled}
                formData={item[key]}
                onChange={handleChange(index, key)}
                registry={registry}
                required={required.includes(key)}
                schema={properties[key]}
                uiSchema={{ 'ui:options': { label: false } }}
              />
            </td>
          ))}
          <td className="tableField__td-action">
            <div>
              <Button
                disabled={index === 0}
                icon="chevron-up"
                minimal
                onClick={() => handleUpdatingRow(index, 'moving-up')}
                small
              />
              <Button
                icon="remove"
                minimal
                onClick={() => handleUpdatingRow(index, 'removing')}
                small
              />
              <Button
                disabled={index === data.length - 1}
                icon="chevron-down"
                minimal
                onClick={() => handleUpdatingRow(index, 'moving-down')}
                small
              />
              <Button
                className="tableField__insert"
                icon="add"
                minimal
                onClick={() => handleUpdatingRow(index + 1, 'inserting')}
                small
              />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

Tbody.propTypes = {
  disabled: PropTypes.bool,
  formData: PropTypes.arrayOf(PropTypes.shape({})),
  schema: PropTypes.shape({
    items: PropTypes.shape({
      properties: PropTypes.shape({}),
      required: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  registry: PropTypes.shape({}),
  uiSchema: PropTypes.shape({
    items: PropTypes.shape({
      'ui:order': PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

Tbody.defaultProps = {
  disabled: false,
  formData: [],
  schema: {
    items: {
      properties: {},
      required: [],
    },
  },
  registry: {},
  uiSchema: {
    items: [],
  },
};
export default Tbody;
