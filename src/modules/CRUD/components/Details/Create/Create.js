import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Form from 'react-jsonschema-form';
import { getJSONSchemaFromGeom } from '../../../services/utils';
import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import RTEField from '../../../../../components/react-json-schemaForm/RTEField';
import GeometryField from '../../../../../components/react-json-schemaForm/GeometryField';
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
 * Clean all useless properties to create feature
 * 1/ Flat all props by removing groups
 * 2/ Keep only required props
 *
 * @param {Object} props JSON schema properties
 * @returns {Object} JSON schema properties cleaned
 */
const cleanProperties = props => {
  const propertiesWithoutGroup = Object.values(props).reduce((list, value) => {
    const { type, properties, required = [] } = value;

    if (type === 'object' && required.length) {
      const requiredProps = Object.entries(properties).reduce((acc, [subKey, subValue]) => (
        required.includes(subKey)
          ? ({ [subKey]: subValue })
          : acc
      ), {});

      return {
        ...list,
        properties: { ...list.properties, ...requiredProps },
        required: [...list.required, ...required],
      };
    }

    return list;
  }, { properties: {}, required: [] });

  return propertiesWithoutGroup;
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

  const { required, properties } = cleanProperties(schemaProperties);

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
    history: { push },
    view: {
      featureEndpoint,
      formSchema: { properties: schemaProperties } = {},
      uiSchema: uiSchemaProperties,
      layer: { geom_type: geomType, name },
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

  useMemo(() => {
    const builder = buildSchema({ schemaProperties, uiSchemaProperties, geomType });
    setSchema(builder.schema);
    setUiSchema(builder.uiSchema);
  }, [geomType, schemaProperties, uiSchemaProperties]);


  const handleSubmit = useCallback(async ({ formData: { geom, ...properties } }) => {
    setLoading(true);

    setSchema(prevSchema => getSchemaWithDefaultValues(prevSchema, properties));

    const savedFeature = await saveFeature(featureEndpoint, false, { geom, properties }, 'POST');

    if (!isMounted.current) return;

    setLoading(false);

    if (savedFeature) {
      push(generateURI('layer', { layer: name, id: savedFeature.identifier }));
      toast.displayToaster(
        { id: savedFeature.identifier },
        t('CRUD.details.successCreateFeature'),
      );
    }
  }, [featureEndpoint, name, push, saveFeature, t]);


  const title = t('CRUD.details.create', { layer: name });

  return (
    <div className="details ">
      <Header title={title} />
      <div className="details__list-create">
        <Form
          className="CRUD-edit CRUD-edit--vertical"
          disabled={loading}
          schema={schema}
          uiSchema={uiSchema}
          fields={{ rte: RTEField, geometry: GeometryField }}
          onSubmit={handleSubmit}
        >
          <Button
            className="CRUD-edit__submit"
            loading={loading}
            type="submit"
          >
            {title}
          </Button>
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
