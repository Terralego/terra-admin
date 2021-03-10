import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import Form from '@rjsf/core';
import { requiredProperties } from '../../../../services/utils';
import customFields from '../../../../../../components/react-json-schemaForm';
import FileWidget from '../../../../../../components/react-json-schemaForm/FileWidget';
import ErrorListTemplate from '../../../../../../components/react-json-schemaForm/ErrorListTemplate';
import './styles.scss';

const widgets = {
  FileWidget: props => (
    <FileWidget {...props} />
  ),
};

const sanitizeValue = (schema, value) => {
  if (schema.type === 'array' && value === null) {
    return [];
  }
  return value;
};

const Edit = ({
  editable,
  editedItem,
  getFeaturesList,
  getSettings,
  isGeom,
  onEdit,
  onRead,
  match: { params: { id } },
  method,
  name,
  saveFeature,
  schema,
  setEditedItem,
  settingsEndpoint,
  t,
  ui_schema: uiSchema,
  url,
  value,
  view: {
    featureEndpoint,
    formSchema: { properties: schemaProperties } = {},
  },
}) => {
  const isMounted = useRef(true);

  const isCurrentEditedItem = editedItem === name;
  const canEdit =  ['', name].includes(editedItem) && editable;
  const isEdited = canEdit && isCurrentEditedItem;
  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(() => sanitizeValue(schema, value));

  useEffect(() => {
    isCurrentEditedItem && !loading ? onEdit(name) : onRead(name);
  }, [isCurrentEditedItem, loading, name, onEdit, onRead]);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    setDefaultValue(sanitizeValue(schema, value));
  }, [schema, value]);

  const handleSubmit = useCallback(async ({ formData }) => {
    const endpoint = url ? url.replace(featureEndpoint, '') : id;

    const [[propKey, propValue]] = Object.entries(formData);

    setLoading(true);

    const body = !isGeom
      ? { properties: { [propKey]: propValue === undefined ? '' : propValue } }
      : { geom: propValue.geom, routing_information: propValue.routingInformation };

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
    getFeaturesList(featureEndpoint);
  }, [
    featureEndpoint,
    getFeaturesList,
    getSettings,
    id,
    isGeom,
    method,
    name,
    onRead,
    saveFeature,
    setEditedItem,
    settingsEndpoint,
    url,
  ]);

  const requiredField = useMemo(() => {
    const { required }  = requiredProperties(schemaProperties);
    return required.includes(name);
  }, [name, schemaProperties]);

  const action = useMemo(() => {
    if (isEdited) {
      return {
        label: t('CRUD.details.cancel'),
        icon: 'small-cross',
      };
    }
    if (!editable) {
      return {
        label:  t('CRUD.details.notAllowedToEdit'),
        icon:  'info-sign',
      };
    }
    return {
      label: t('CRUD.details.update'),
      icon: 'edit',
    };
  }, [editable, isEdited, t]);

  const enhanceUISchema = useMemo(() => {
    if (schema.type === 'string' && schema.enum?.length) {
      return { 'ui:placeholder': t('CRUD.details.placeholderSelect'), ...uiSchema };
    }
    return uiSchema;
  }, [schema.enum, schema.type, t, uiSchema]);

  return (
    <div className="details__list-edit">
      <Tooltip
        className="details__list-edit-button"
        content={action.label}
        position={Position.TOP}
        usePortal
        intent={!editable ? Intent.WARNING : Intent.INFO}
      >
        <Button
          icon={action.icon}
          disabled={!canEdit}
          onClick={() => setEditedItem(canEdit && !isCurrentEditedItem ? name : '')}
          minimal
        />
      </Tooltip>
      {isCurrentEditedItem && (
        <Form
          className="CRUD-edit"
          disabled={loading}
          fields={customFields}
          ErrorList={ErrorListTemplate}
          onSubmit={handleSubmit}
          uiSchema={{ [name]: { ...enhanceUISchema } }}
          schema={{
            type: 'object',
            required: [requiredField && name].filter(Boolean),
            properties: {
              [name]: {
                ...schema,
                ...(defaultValue !== null && { default: defaultValue }),
              },
            },
          }}
          widgets={widgets}
        >
          {requiredField && (
            <span className="details__list-edit-mandatory details__list-edit-mandatory--edit">{t('CRUD.details.mandatory')}</span>
          )}
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
  editable: PropTypes.bool,
  editedItem: PropTypes.string,
  isGeom: PropTypes.bool,
  getSettings: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  method: PropTypes.oneOf(['PATCH', 'POST', 'PUT']),
  onEdit: PropTypes.func,
  onRead: PropTypes.func,
  name: PropTypes.string,
  saveFeature: PropTypes.func,
  setEditedItem: PropTypes.func,
  schema: PropTypes.shape({
    enum: PropTypes.arrayOf(PropTypes.string),
    properties: PropTypes.shape({}),
    type: PropTypes.string,
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
  editable: true,
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
