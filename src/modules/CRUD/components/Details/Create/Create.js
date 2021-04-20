import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Form from '@rjsf/core';
import { getJSONSchemaFromGeom, requiredProperties } from '../../../services/utils';
import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import customFields from '../../../../../components/react-json-schemaForm';
import ErrorListTemplate from '../../../../../components/react-json-schemaForm/ErrorListTemplate';
import Header from '../Header';

/**
 * Get schema with default values
 *
 * @param {Object} schema
 * @param {Object} properties
 * @param {Boolean} resetValues
 * @returns schema with default values setted
 */
const getSchemaWithValues = (schema, properties, resetValues) => {
  const defaultValues = Object.entries(properties);
  if (!defaultValues.length) {
    return schema;
  }
  const nextSchema = { ...schema };
  defaultValues.forEach(([key, value]) => {
    if (!resetValues) {
      nextSchema.properties[key].default = value;
    } else {
      delete nextSchema.properties[key].default;
    }
  });
  return nextSchema;
};

/**
 * Build a json schema object
 *
 * @param {Object} {
 * formSchema {Object},
 * uiSchemaProperties {Object},
 * geomType {Number}
 *  }
 * @returns an object compatible with jsonSchema specification
 */
const buildSchema = ({ formSchema, uiSchemaProperties, geomType, t }) => {
  const {
    schema: geomSchema,
    ui_schema: geomUiSchema,
    value,
  } = getJSONSchemaFromGeom({ identifier: null, geom: null, title: 'Geométrie', geom_type: geomType });

  const rootSchema = requiredProperties({ root: { type: 'object', ...formSchema } });
  const groupSchema = requiredProperties(formSchema.properties);

  const properties = {
    geom: { ...geomSchema, default: value },
    ...rootSchema.properties,
    ...groupSchema.properties,
  };

  const { 'ui:order': uiOrder = ['*'] } = uiSchemaProperties;

  const enhanceUISchema = Object.entries(properties).reduce((ui, [key, prop]) => {
    if (prop.type === 'string' && prop.enum?.length) {
      // eslint-disable-next-line no-param-reassign
      ui[key] = {
        ...uiSchemaProperties[key],
        'ui:placeholder': uiSchemaProperties[key]?.['ui:placeholder'] ?? t('CRUD.details.placeholderSelect'),
      };
    }
    return ui;
  }, {});

  const uiSchema = {
    geom: geomUiSchema,
    ...uiSchemaProperties,
    ...enhanceUISchema,
    'ui:order': [...uiOrder, 'geom'],
  };

  return {
    schema: {
      properties,
      required: ['geom', ...rootSchema.required, ...groupSchema.required],
      type: 'object',
    },
    uiSchema,
  };
};

const Create = props => {
  const {
    getFeaturesList,
    history: { push },
    view: {
      featureEndpoint,
      formSchema = {},
      uiSchema: uiSchemaProperties,
      layer: { geom_type: geomType, name },
      objectName = name,
    },
    saveFeature,
    t,
  } = props;

  const isMounted = useRef(true);

  const [loading, setLoading] = useState(false);
  const [schema, setSchema] = useState({});
  const [uiSchema, setUiSchema] = useState({});

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const builder = buildSchema({ formSchema, uiSchemaProperties, geomType, t });
    setSchema(builder.schema);
    setUiSchema(builder.uiSchema);
  }, [geomType, formSchema, uiSchemaProperties, t]);


  const handleSubmit = useCallback(async ({
    formData: { geom: { geom, routingInformation },
      ...properties },
  }) => {
    setLoading(true);
    setSchema(prevSchema => getSchemaWithValues(prevSchema, properties));

    const savedFeature = await saveFeature(featureEndpoint, false, { geom, properties, routing_information: routingInformation }, 'POST');

    setLoading(false);


    if (savedFeature.feature) {
      setSchema(prevSchema => getSchemaWithValues(prevSchema, properties, true));
      push(generateURI('layer', { layer: name, id: savedFeature.feature.identifier }));
      toast.displayToaster(
        { id: savedFeature.feature.identifier },
        t('CRUD.details.successCreateFeature'),
      );
      getFeaturesList(featureEndpoint);
    } else {
      toast.displayError(
        <>
          <h3>{savedFeature.error.message}</h3>
          {savedFeature.error.data && <p>{Object.values(savedFeature.error.data).join(', ')}</p>}
        </>,
      );
    }
  }, [featureEndpoint, getFeaturesList, name, push, saveFeature, t]);

  const handleValidate = useCallback((formData, errors) => {
    if (!formData.geom.geom?.coordinates.length) {
      errors.addError(t('CRUD.details.errorNoGeometry'));
    }
    return errors;
  }, [t]);

  const title = t('CRUD.details.create', { layer: objectName });

  return (
    <div className="details ">
      <Header title={title} />
      <div className="details__list-create">
        <Form
          className="CRUD-edit CRUD-edit--vertical"
          disabled={loading}
          ErrorList={ErrorListTemplate}
          schema={schema}
          uiSchema={uiSchema}
          fields={customFields}
          onSubmit={handleSubmit}
          validate={handleValidate}
        >
          <div className="details__list-edit-action">
            <span className="details__list-edit-mandatory">{t('CRUD.details.mandatory_plural')}</span>
            <Button
              className="CRUD-edit__submit"
              intent="primary"
              loading={loading}
              type="submit"
            >
              {t('CRUD.details.save')}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

Create.propTypes = {
  view: PropTypes.shape({
    formSchema: PropTypes.shape({
      properties: PropTypes.shape({}),
    }),
    uiSchema: PropTypes.shape({}),
    layer: PropTypes.shape({
      geom_type: PropTypes.number,
      name: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
};

Create.defaultProps = {
  view: {
    formSchema: { properties: {} },
    uiSchema: {},
    layer: {
      geom_type: null,
      name: undefined,
    },
  },
  t: text => text,
};

export default Create;
