import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from '@rjsf/core';
import classNames from 'classnames';
import { CRUDContext } from '../../../../services/CRUDProvider';
import { getView } from '../../../../services/CRUD';
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

const isFeatureToDelete = (isGeom, value, method) => {
  if (!isGeom || value.geom === null) {
    return false;
  }
  if (value.geom.coordinates.length === 0 && method === 'PATCH') {
    return true;
  }
  return false;
};

const Edit = ({
  editable,
  editedItem,
  isGeom,
  method,
  onEdit,
  onRead,
  name,
  schema,
  setEditedItem,
  settingsEndpoint,
  ui_schema: uiSchema,
  url,
  value: displayValue,
}) => {
  const { t } = useTranslation();
  const { id, layer } = useParams();

  const {
    feature,
    getFeaturesList,
    getSettings,
    settings,
    deleteFeature,
    saveFeature,
    fetchFeature,
  } = useContext(CRUDContext);

  const value = useMemo(() => {
    if (isGeom) {
      return sanitizeValue(schema, displayValue);
    }
    const { properties } = feature[id] || {};
    const propertiesListed = Object.values(properties).reduce(
      (list, item) => ({ ...list, ...item }
      ), {},
    );
    return sanitizeValue(schema, propertiesListed[name]);
  }, [displayValue, feature, id, isGeom, name, schema]);


  const {
    featureEndpoint,
    formSchema: { properties: schemaProperties } = {},
  } = useMemo(() => getView(settings, layer), [layer, settings]);

  const isMounted = useRef(true);

  const isCurrentEditedItem = editedItem === name;
  const canEdit =  ['', name].includes(editedItem) && editable;
  const isEdited = canEdit && isCurrentEditedItem;
  const [loading, setLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState(value);

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
      : {
        geom: propValue.geom,
        ...(propValue.routingInformation && { routing_information: propValue.routingInformation }),
      };

    setDefaultValue(propValue);

    const isDeleting = isFeatureToDelete(isGeom, propValue, method);
    const saveOrDeleteFeature = isDeleting
      ? deleteFeature
      : saveFeature;

    const savedFeatures = await saveOrDeleteFeature(
      featureEndpoint,
      endpoint,
      body,
      method,
    );

    if (!isMounted.current) return;

    if (!savedFeatures.error) {
      getSettings(settingsEndpoint);
      if (isDeleting) {
        await fetchFeature(featureEndpoint, id);
      } else {
        getFeaturesList(featureEndpoint);
      }
      if (!isMounted.current) return;
      setEditedItem('');
      onRead(name);
    }
    setLoading(false);
  },
  [
    deleteFeature,
    featureEndpoint,
    fetchFeature,
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
          className={classNames({ 'CRUD-edit': true, 'CRUD-edit--block': isGeom })}
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
  method: PropTypes.oneOf(['PATCH', 'POST', 'PUT']),
  onEdit: PropTypes.func,
  onRead: PropTypes.func,
  name: PropTypes.string,
  schema: PropTypes.shape({
    enum: PropTypes.arrayOf(PropTypes.string),
    properties: PropTypes.shape({}),
    type: PropTypes.string,
  }),
  setEditedItem: PropTypes.func,
  ui_schema: PropTypes.shape({}),
  url: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any,
};

Edit.defaultProps = {
  editable: true,
  editedItem: '',
  isGeom: false,
  method: 'PATCH',
  onEdit: () => {},
  onRead: () => {},
  name: undefined,
  schema: {},
  setEditedItem: () => {},
  ui_schema: {},
  url: undefined,
  value: null,
};

export default Edit;
