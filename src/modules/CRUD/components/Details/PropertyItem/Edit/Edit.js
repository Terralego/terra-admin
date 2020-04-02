import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Form from 'react-jsonschema-form';
import customFields from '../../../../../../components/react-json-schemaForm';
import FileWidget from '../../../../../../components/react-json-schemaForm/FileWidget';
import ErrorListTemplate from '../../../../../../components/react-json-schemaForm/ErrorListTemplate';
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

const submitFeature = props => async ({ formData }) => {
  const {
    view: { featureEndpoint },
    isGeom,
    isMounted,
    getSettings,
    match: { params: { id } },
    method,
    name,
    onRead,
    url,
    saveFeature,
    setDefaultValue,
    setEditedItem,
    setLoading,
    settingsEndpoint,
  } = props;

  const endpoint = url ? url.replace(featureEndpoint, '') : id;

  const [[propKey, propValue]] = Object.entries(formData);

  const valueOrEmptyString = propValue === undefined ? '' : propValue;

  setLoading(true);

  const body = !isGeom
    ? { properties: { [propKey]: valueOrEmptyString } }
    : { geom: valueOrEmptyString };

  setDefaultValue(propValue);

  await saveFeature(
    featureEndpoint,
    endpoint,
    body,
    method,
  );

  if (!isMounted.current) return;

  setLoading(false);
  setEditedItem('');
  onRead(name);
  getSettings(settingsEndpoint);
};

const Edit = props => {
  const {
    editedItem,
    name,
    onEdit,
    onRead,
    setEditedItem,
    schema,
    schema: { type: schemaType },
    t,
    ui_schema: uiSchema,
    value,
  } = props;

  const isMounted = useRef(true);

  const isCurrentEditedItem = editedItem === name;
  const canEdit =  ['', name].includes(editedItem);
  const isEdited = canEdit && isCurrentEditedItem;
  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(sanitizeValue(schemaType, value));

  useEffect(() => {
    isCurrentEditedItem && !loading ? onEdit(name) : onRead(name);
  }, [isCurrentEditedItem, loading, name, onEdit, onRead]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setDefaultValue(sanitizeValue(schemaType, value));
  }, [schemaType, value]);


  return (
    <div className="details__list-edit">
      <Button
        className="details__list-edit-button"
        icon={isEdited ? 'small-cross' : 'edit'}
        disabled={!canEdit}
        onClick={() => setEditedItem(canEdit && !isCurrentEditedItem ? name : '')}
        minimal
        title={isEdited ? t('CRUD.details.cancel') : t('CRUD.details.update')}
      />
      {isCurrentEditedItem && (
      <Form
        className="CRUD-edit"
        disabled={loading}
        fields={customFields}
        ErrorList={ErrorListTemplate}
        onSubmit={
          submitFeature({ isMounted, setDefaultValue, setEditedItem, setLoading, ...props })
        }
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
  // eslint-disable-next-line react/no-unused-prop-types
  isGeom: PropTypes.bool,
  // eslint-disable-next-line react/no-unused-prop-types
  getSettings: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  method: PropTypes.oneOf(['PATCH', 'POST', 'PUT']),
  onEdit: PropTypes.func,
  onRead: PropTypes.func,
  name: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
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
  isGeom: false,
  getSettings: () => {},
  match: {
    params: {
      id: undefined,
    },
  },
  method: 'PATCH',
  onEdit: () => {},
  onRead: () => {},
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
