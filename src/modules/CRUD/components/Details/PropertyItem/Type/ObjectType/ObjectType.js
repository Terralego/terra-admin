import React from 'react';
import PropTypes from 'prop-types';
import { getObjectOrderedValue } from '../../../../../services/utils';

import Type from '..';
import NoValue from '../../NoValue';

const ObjectType = ({
  display_value: displayValue,
  schema: { properties },
  t,
  ui_schema: uiSchema,
  ui_schema: {
    'ui:order': UIOrder = [],
  } = {},
}) => {
  if (displayValue === null) {
    return <NoValue t={t} />;
  }

  const orderedValue = getObjectOrderedValue(displayValue, UIOrder);

  return (
    <div className="details__Object">
      {Object.keys(orderedValue).map(value => {
        const { title = value } = properties[value] || {};
        return (
          <div className="details__Object-group" key={title}>
            <div className="details__Object-key">
              {title} :
            </div>
            <div className="details__Object-value">
              <Type
                display_value={orderedValue[value]}
                schema={properties[value]}
                ui_schema={uiSchema[value]}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

ObjectType.propTypes = {
  display_value: PropTypes.shape({}),
  schema: PropTypes.shape({
    properties: PropTypes.shape({}),
  }),
  t: PropTypes.func,
  ui_schema: PropTypes.shape({
    'ui:order': PropTypes.array,
  }),
};

ObjectType.defaultProps = {
  display_value: null,
  schema: {
    properties: {},
  },
  t: text => text,
  ui_schema: {
    'ui:order': [],
  },
};

export default ObjectType;
