import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { getJSONSchemaFromGeom } from '../../../../services/utils';

import PropertyList from '../../PropertyList';

const getProperties = geometries => {
  const properties = { ...geometries };
  Object.entries(properties).forEach(([key, value], index) => {
    properties[key] = getJSONSchemaFromGeom(value, index);
  });
  return properties;
};

const GeomView = ({ geometries }) => {
  const properties = useMemo(() => getProperties(geometries), [geometries]);

  return (
    <PropertyList
      properties={properties}
      isGeom
    />
  );
};

GeomView.propTypes = {
  geometries: PropTypes.shape({}),
};

GeomView.defaultProps = {
  geometries: {},
};

export default GeomView;
