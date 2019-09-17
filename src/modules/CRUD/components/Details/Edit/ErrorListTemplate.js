import React from 'react';
import PropTypes from 'prop-types';
import { Callout } from '@blueprintjs/core';

const ErrorListTemplate = ({ errorSchema: { __errors, ...fields }, schema: { properties } }) => {
  const errors = Object.keys(fields).reduce((list, item) => {
    const { __errors: errorsItem } = fields[item];
    return errorsItem.length
      ? [...list, { title: properties[item].title, list: errorsItem }]
      : list;
  }, []);

  return (
    <Callout intent="danger">
      <ul>
        {errors.map(({ title, list }) => (
          <li key={title}>
            {title} :
            <ul>
              {list.map(item => <li key={item}>{item}</li>)}
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
