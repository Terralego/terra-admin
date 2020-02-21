import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Form from 'react-jsonschema-form';
import RTEField from '../../../../../../components/react-json-schemaForm/RTEField';
import FileWidget from '../../../../../../components/react-json-schemaForm/FileWidget';
import './styles.scss';

const widgets = {
  FileWidget: props => (
    <FileWidget {...props} />
  ),
};

const sanitizeValue = (type, value) => {
  if (type === 'array' && value === null) {
    return [];
  }
  return value;
};

const Edit = ({
  editedItem,
  name,
  setEditedItem,
  schema,
  t,
  ui_schema: uiSchema,
  value,
  ...rest
}) => {
  const isCurrentEditedItem = editedItem === name;
  const canEdit =  ['', name].includes(editedItem);
  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(sanitizeValue(schema.type, value));


  const submitFeature = async ({ formData }) => {
    const {
      match: { params: { id } },
      saveFeature,
      view: { featureEndpoint },
    } = rest;

    const [[propKey, propValue]] = Object.entries(formData);

    const valueOrEmptyString = propValue === undefined ? '' : propValue;

    setDefaultValue(propValue);
    setLoading(true);

    await saveFeature(
      featureEndpoint,
      id,
      { properties: { [propKey]: valueOrEmptyString } },
      'PATCH',
    );

    setLoading(false);
    setEditedItem('');
  };

  return (
    <div className="details__list-edit">
      <Button
        className="details__list-edit-button"
        icon={canEdit && isCurrentEditedItem ? 'small-cross' : 'edit'}
        disabled={!canEdit}
        onClick={() => setEditedItem(canEdit && !isCurrentEditedItem ? name : '')}
        minimal
      />
      {isCurrentEditedItem && (
      <Form
        className="CRUD-edit"
        disabled={loading}
        fields={{ rte: RTEField }}
        onSubmit={submitFeature}
        uiSchema={{ [name]: { ...uiSchema } }}
        schema={{
          type: 'object',
          properties: {
            [name]: {
              ...schema,
              default: defaultValue,
            },
          },
        }}
        widgets={widgets}
      >
        <Button
          className="CRUD-edit__submit"
          loading={loading}
          type="submit"
        >
          {t('CRUD.details.save')}
        </Button>
      </Form>
      )}
    </div>
  );
};

Edit.propTypes = {
  editedItem: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
  saveFeature: PropTypes.func,
  setEditedItem: PropTypes.func,
  schema: PropTypes.shape({
    type: PropTypes.string,
    properties: PropTypes.shape({}),
  }),
  t: PropTypes.func,
  ui_schema: PropTypes.shape({}),
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
  view: PropTypes.shape({
    featureEndpoint: PropTypes.string,
  }),
};

Edit.defaultProps = {
  editedItem: '',
  match: {
    params: {
      id: undefined,
    },
  },
  name: undefined,
  saveFeature: () => {},
  setEditedItem: () => {},
  schema: {},
  t: text => text,
  ui_schema: {},
  value: null,
  view: {
    featureEndpoint: undefined,
  },
};

export default Edit;
