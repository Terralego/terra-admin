import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
 * @returns schema with default values setted
 */
const getSchemaWithDefaultValues = (schema, properties) => {
  const defaultValues = Object.entries(properties);
  if (!defaultValues.length) {
    return schema;
  }
  const nextSchema = { ...schema };
  defaultValues.forEach(([key, value]) => {
    nextSchema.properties[key].default = value;
  });
  return nextSchema;
};

/**
 * Build a json schema object
 *
 * @param {Object} {
 * schemaProperties {Object},
 * uiSchemaProperties {Object},
 * geomType {Number}
 *  }
 * @returns an object compatible with jsonSchema specification
 */
const buildSchema = ({ schemaProperties, uiSchemaProperties, geomType }) => {
  const {
    schema: geomSchema,
    ui_schema: geomUiSchema,
    value,
  } = getJSONSchemaFromGeom({ identifier: null, geom: null, title: 'Geométrie', geom_type: geomType });

  const { required, properties } = requiredProperties(schemaProperties);

  const { 'ui:order': uiOrder = [] } = uiSchemaProperties;

  return {
    schema: {
      properties: { geom: { ...geomSchema, default: value }, ...properties },
      required: ['geom', ...required],
      type: 'object',
    },
    uiSchema: {
      geom: geomUiSchema,
      ...uiSchemaProperties,
      'ui:order': ['geom', ...uiOrder],
    },
  };
};

const Create = props => {
  const {
    featureError,
    getFeaturesList,
    history: { push },
    view: {
      featureEndpoint,
      formSchema: { properties: schemaProperties } = {},
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
    if (featureError?.error?.message) {
      toast.displayError(featureError.error.message);
    }
  }, [featureError]);

  useMemo(() => {
    const builder = buildSchema({ schemaProperties, uiSchemaProperties, geomType });
    setSchema(builder.schema);
    setUiSchema(builder.uiSchema);
  }, [geomType, schemaProperties, uiSchemaProperties]);


  const handleSubmit = useCallback(async ({
    formData: { geom: { geom, routingInformation },
      ...properties },
  }) => {
    setLoading(true);

    setSchema(prevSchema => getSchemaWithDefaultValues(prevSchema, properties));

    const savedFeature = await saveFeature(featureEndpoint, false, { geom, properties, routing_information: routingInformation }, 'POST');

    setLoading(false);

    if (savedFeature) {
      push(generateURI('layer', { layer: name, id: savedFeature.identifier }));
      toast.displayToaster(
        { id: savedFeature.identifier },
        t('CRUD.details.successCreateFeature'),
      );
      getFeaturesList(featureEndpoint);
    }
  }, [featureEndpoint, getFeaturesList, name, push, saveFeature, t]);

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
        >
          <div className="details__list-edit-action">
            <span className="details__list-edit-mandatory">{t('CRUD.details.mandatory_plural')}</span>
            <Button
              className="CRUD-edit__submit"
              loading={loading}
              type="submit"
            >
              {title}
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
