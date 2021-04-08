import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Form from '@rjsf/core';
import { get2DCoordinates, getJSONSchemaFromGeom, requiredProperties } from '../../../services/utils';
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
 * formSchema {Object},
 * uiSchemaProperties {Object},
 * geomType {Number}
 *  }
 * @returns an object compatible with jsonSchema specification
 */
const buildSchema = ({ formSchema, uiSchemaProperties, geomType }) => {
  const {
    schema: geomSchema,
    ui_schema: geomUiSchema,
    value,
  } = getJSONSchemaFromGeom({ identifier: null, geom: null, title: 'Geométrie', geom_type: geomType });

  const rootSchema = requiredProperties({ root: { type: 'object', ...formSchema } });
  const groupSchema = requiredProperties(formSchema.properties);

  const { 'ui:order': uiOrder = ['*'] } = uiSchemaProperties;

  return {
    schema: {
      properties: {
        geom: { ...geomSchema, default: value },
        ...rootSchema.properties,
        ...groupSchema.properties,
      },
      required: ['geom', ...rootSchema.required, ...groupSchema.required],
      type: 'object',
    },
    uiSchema: {
      geom: geomUiSchema,
      ...uiSchemaProperties,
      'ui:order': [...uiOrder, 'geom'],
    },
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
    const builder = buildSchema({ formSchema, uiSchemaProperties, geomType });
    setSchema(builder.schema);
    setUiSchema(builder.uiSchema);
  }, [geomType, formSchema, uiSchemaProperties]);


  const handleSubmit = useCallback(async ({
    formData: { geom: { geom, routingInformation },
      ...properties },
  }) => {
    setLoading(true);

    setSchema(prevSchema => getSchemaWithDefaultValues(prevSchema, properties));

    const savedFeature = await saveFeature(featureEndpoint, false, { geom, properties, routing_information: get2DCoordinates(routingInformation) }, 'POST');

    setLoading(false);


    if (savedFeature.feature) {
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
