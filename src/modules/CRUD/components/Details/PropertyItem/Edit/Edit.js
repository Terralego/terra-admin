import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Intent, Position, Tooltip } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from '@rjsf/core';
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
  if (schema.enum?.length) {
    return schema.enum[0];
  }
  return value;
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
  value,
}) => {
  const { t } = useTranslation();
  const { id, layer } = useParams();

  const {
    getFeaturesList,
    getSettings,
    settings,
    saveFeature,
  } = useContext(CRUDContext);

  const {
    featureEndpoint,
    formSchema: { properties: schemaProperties } = {},
  } = useMemo(() => getView(settings, layer), [layer, settings]);

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

    const savedFeatures = await saveFeature(
      featureEndpoint,
      endpoint,
      body,
      method,
    );

    if (!isMounted.current) return;

    setLoading(false);
    if (savedFeatures.feature) {
      setEditedItem('');
      onRead(name);
      getSettings(settingsEndpoint);
      getFeaturesList(featureEndpoint);
    }
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
          uiSchema={{ [name]: { ...uiSchema } }}
          schema={{
            type: 'object',
            required: [requiredField && name].filter(Boolean),
            properties: {
              [name]: {
                ...schema,
                default: defaultValue,
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
