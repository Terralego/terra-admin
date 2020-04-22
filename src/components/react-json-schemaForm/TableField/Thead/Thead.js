import React from 'react';
import PropTypes from 'prop-types';
import { getObjectOrderedValue } from '../../../../modules/CRUD/services/utils';


const Thead = ({
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
  const orderedValue = getObjectOrderedValue(properties, uiSchemaItems['ui:order']);
  return (
    <thead>
      <tr>
        {Object.entries(orderedValue).map(([key, { title }]) => {
          const { [key]: { 'ui:help': help } = {} } = uiSchemaItems;
          return (
            <th key={key}>
              {title}
              {required.includes(key) && <span>*</span>}
              {help && <span className="details__table-help">({help})</span>}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

Thead.propTypes = {
  schema: PropTypes.shape({
    items: PropTypes.shape({
      properties: PropTypes.shape({}),
      required: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
  uiSchema: PropTypes.shape({
    items: PropTypes.shape({
      'ui:order': PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

Thead.defaultProps = {
  schema: {
    items: {
      properties: {},
      required: [],
    },
  },
  uiSchema: {
    items: [],
  },
};

export default Thead;
