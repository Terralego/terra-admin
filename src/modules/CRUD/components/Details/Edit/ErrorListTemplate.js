import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core';

const getProperties = props => Object.keys(props).reduce((list, item) => {
  const { type, properties, title } = props[item];
  const customProperties = type === 'object'
    ? getProperties(properties)
    : { [item]: title };

  return {
    ...list,
    ...customProperties,
  };
}, {});

const ErrorListTemplate = ({ errors, schema: { properties: schemaProperties } }) => {
  const properties = getProperties(schemaProperties);

  const listErrors = errors.reduce((list, { stack }) => {
    const [field, value] = stack.split(':');
    const fieldName = properties[field];
    const listValue = (fieldName in list)
      ? [...list[fieldName], value.trim()]
      : [value.trim()];
    return {
      ...list,
      [fieldName]: listValue,
    };
  }, {});

  return (
    <Callout intent="danger">
      <ul>
        {Object.keys(listErrors).map(error => (
          <li key={error}>
            {error} :
            <ul>
              {listErrors[error].map(item => <li key={item}>{item}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </Callout>
  );
};

ErrorListTemplate.propTypes = {
  errorSchema: PropTypes.shape({}).isRequired,
  schema: PropTypes.shape({
    properties: PropTypes.shape({}),
  }).isRequired,
};

export default ErrorListTemplate;
