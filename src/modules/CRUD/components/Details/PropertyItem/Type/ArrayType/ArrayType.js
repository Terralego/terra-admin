import React from 'react';
import PropTypes from 'prop-types';
import { getObjectOrderedValue, isTableObject } from '../../../../../services/utils';

import Type from '..';
import NoValue from '../../NoValue';

const ArrayType = ({
  display_value: displayValue,
  schema,
  ui_schema: uiSchema = {},
}) => {
  if (displayValue === null || !displayValue.length) {
    return <NoValue />;
  }

  const { items: { properties, type } } = schema;
  const { items: { 'ui:order': UIOrder } = {} } = uiSchema;

  if (type === 'object') {
    const orderedValue = displayValue.map(value => getObjectOrderedValue(value, UIOrder));
    if (isTableObject(orderedValue)) {
      const columns = Object.keys(orderedValue[0]).map(value => properties[value].title);
      return (
        <table className="details__table">
          <thead>
            <tr>
              {columns.map((th, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <th key={i}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderedValue.map((row, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={i}>
                {Object.entries(row).map(([key, value]) => (
                  <td key={key}>
                    <Type
                      display_value={value}
                      ui_schema={uiSchema.items[key]}
                      schema={schema.items.properties[key]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return displayValue.map((value, i) => (
      <Type
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        display_value={value}
        ui_schema={uiSchema.items}
        schema={schema.items}
        type={schema.items.type}
      />
    ));
  }
  return displayValue.join(', ');
};

ArrayType.propTypes = {
  display_value: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])),
  schema: PropTypes.shape({
    items: PropTypes.shape({
      type: PropTypes.string,
    }),
  }),
  ui_schema: PropTypes.shape({
    items: PropTypes.shape({
      'ui:order': PropTypes.array,
    }),
  }),
};

ArrayType.defaultProps = {
  display_value: null,
  schema: {
    items: {
      type: undefined,
    },
  },
  ui_schema: {
    items: {
      'ui:order': [],
    },
  },
};

export default ArrayType;
