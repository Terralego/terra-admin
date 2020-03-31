import React from 'react';
import PropTypes from 'prop-types';
import { getObjectOrderedValue, isTableObject } from '../../../../../../services/utils';

import Type from '../../Type';

const ArrayOfObjects = ({
  display_value: displayValue,
  schema: { items: schemaItems },
  ui_schema: { items: uiSchemaItems = {}, 'ui:field': uiField } = {},
}) => {
  const { properties = {}, type } = schemaItems;

  const orderedValue = displayValue.map(value => getObjectOrderedValue(value, uiSchemaItems['ui:order']));

  if (uiField !== 'table' && !isTableObject(orderedValue)) {
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

  const columns = Object.entries(getObjectOrderedValue(properties, uiSchemaItems['ui:order']));

  return (
    <div className="details__table">
      <table>
        <thead>
          <tr>
            {columns.map(([key, value]) => {
              const title =  properties[key].title || value;
              const { 'ui:help': help } =  uiSchemaItems[key] || {};
              return (
                <th key={key}>
                  {title}
                  {help && <span className="details__table-help">({help})</span>}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {orderedValue.map((row, i) => (
          // eslint-disable-next-line react/no-array-index-key
            <tr key={i}>
              {columns.map(([key]) => (
                <td key={key}>
                  <Type
                    display_value={row[key]}
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
