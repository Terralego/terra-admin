import React from 'react';
import PropTypes from 'prop-types';
import DefaultDescriptionField from 'react-jsonschema-form/lib/components/fields/DescriptionField';
import {
  isMultiSelect,
  getUiOptions,
  isFilesArray,
} from 'react-jsonschema-form/lib/utils';

const REQUIRED_FIELD_SYMBOL = '*';

const Label = ({ label, required, id }) => !!label && (
  <label className="control-label" htmlFor={id}>
    {label}
    {required && <span className="required">{REQUIRED_FIELD_SYMBOL}</span>}
  </label>
);

const displayLabel = ({
  schema,
  uiSchema,
  definitions,
}) => {
  const { forceLabelDisplay } = getUiOptions(uiSchema);
  if (forceLabelDisplay) {
    return true;
  }
  if (schema.type === 'array') {
    return isMultiSelect(schema, definitions) || isFilesArray(schema, uiSchema, definitions);
  }
  if (schema.type === 'object') {
    return false;
  }
  if (schema.type === 'boolean' && !uiSchema['ui:widget']) {
    return false;
  }
  return true;
};

const DefaultLabel = props => {
  if (!displayLabel(props)) {
    return null;
  }

  const {
    schema,
    id,
    required,
    uiSchema,
    name,
    fields = {},
    formContext,
  } = props;

  const label = uiSchema['ui:title'] || schema.title || name;
  const description = uiSchema['ui:description'] || schema.description;

  const { DescriptionField = DefaultDescriptionField } = fields;

  return (
    <>
      <Label label={label} id={id} required={required} />
      {description && (
        <DescriptionField
          id={`${id}__description`}
          description={description}
          formContext={formContext}
        />
      )}
    </>
  );
};

export default DefaultLabel;


displayLabel.PropTypes = {
  schema: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.oneOf(['string, boolean', 'array', 'object', undefined]),
  }).isRequired,
  name: PropTypes.string.required,
  uiSchema: PropTypes.shape({
    'ui:title': PropTypes.string,
    'ui:description': PropTypes.string,
  }),
  fields: PropTypes.shape({}),
  formContext: PropTypes.shape({}),
};

displayLabel.defaultProps = {
  uiSchema: {
    'ui:title': '',
    'ui:description': '',
  },
  fields: {},
  formContext: {},
};
