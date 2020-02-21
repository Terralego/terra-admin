import React from 'react';
import PropTypes from 'prop-types';
import { getObjectOrderedValue, isTableObject } from '../../../../../../services/utils';

import Type from '../../Type';

const ArrayOfObjects = ({
  display_value: displayValue,
  schema: { items: schemaItems },
  ui_schema: { items: uiSchemaItems = {} } = {},
}) => {
  const orderedValue = displayValue.map(value => getObjectOrderedValue(value, uiSchemaItems['ui:order']));

  if (!isTableObject(orderedValue)) {
    return displayValue.map((value, i) => (
      <Type
        // eslint-disable-next-line react/no-array-index-key
        key={i}
        display_value={value}
        schema={schemaItems}
        ui_schema={uiSchemaItems}
        type={schemaItems.type}
      />
    ));
  }

  const { properties = {}, type } = schemaItems;
  const columns = Object.entries(orderedValue[0]);
  return (
    <div className="details__table">
      <table>
        <thead>
          <tr>
            {columns.map(([key, value]) => (
              <th key={key}>{properties[key].title || value}</th>
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
                    schema={properties[key]}
                    ui_schema={uiSchemaItems[key]}
                    type={type[key]}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ArrayOfObjects.propTypes = {
  display_value: PropTypes.arrayOf(PropTypes.shape({})),
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

ArrayOfObjects.defaultProps = {
  display_value: [],
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

export default ArrayOfObjects;
