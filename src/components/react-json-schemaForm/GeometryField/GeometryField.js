import React, { useState, useEffect, useReducer, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import { getGeometries } from './utils';

import { ACTION_CREATE } from '../../../modules/CRUD/services/CRUD';
import { CRUDContext } from '../../../modules/CRUD/services/CRUDProvider';

import ImportGeomFile from '../../ImportGeomFile';

import MapInteraction from './MapInteraction';
import PointField from './PointField';
import DefaultField from './DefaultField';
import './styles.scss';


function reducer (state, action) {
  return { ...state, ...action };
}

const GeometryField = ({
  formData,
  name,
  ...rest
}) => {
  const { t } = useTranslation();

  const {
    feature,
    settings,
  } = useContext(CRUDContext);

  const params = useParams();

  const geometries = useMemo(
    () => getGeometries({ feature, formData, params, name, settings }),
    [feature, formData, name, params, settings],
  );

  const [geomValues, setGeomValues] = useState(geometries);
  const [featuresToFitBounds, setFeaturesToFitBounds] = useState(null);

  const [nextFormData, setFormData] = useReducer(reducer, {
    geom: geomValues.geom,
    routingInformation: geomValues.routingInformation,
  });

  useEffect(() => {
    setGeomValues(geometries);
    return () => {
      setGeomValues(geometries);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setFormData({ geom: geomValues.geom, routingInformation: geomValues.routingInformation });
    return () => {
      setFormData({ geom: geomValues.geom, routingInformation: geomValues.routingInformation });
    };
  }, [geomValues.geom, geomValues.routingInformation, params]);

  const importDraw = useCallback(nextFeatures => {
    setFeaturesToFitBounds(nextFeatures);
  }, []);

  const TypeField = formData.type === 'Point' ? PointField : DefaultField;
  const {
    schema: { required = [] },
  } = rest;
  const isRequired = required.includes('coordinates');

  return (
    <fieldset>
      <MapInteraction
        featuresToFitBounds={featuresToFitBounds}
        geomValues={geomValues}
        setFeaturesToFitBounds={setFeaturesToFitBounds}
        setFormData={setFormData}
      />
      <legend>{t('jsonSchema.geometryField.title')}</legend>
      {isRequired && params.id !== ACTION_CREATE && (
        <span className="details__list-edit-mandatory details__list-edit-mandatory--edit">
          {t('CRUD.details.mandatory')}
        </span>
      )}
      <div className="form-group field">
        <ImportGeomFile
          geomType={geomValues.geomType}
          hasDraws={Boolean(geomValues?.geom?.coordinates.length)}
          onSubmit={importDraw}
        />
        <p className="form-group__or">{t('jsonSchema.geometryField.or')}</p>
        <TypeField
          {...rest}
          required={isRequired}
          formData={nextFormData}
          t={t}
        />
      </div>
    </fieldset>
  );
};

GeometryField.propTypes = {
  formData: PropTypes.shape({
    coordinates: PropTypes.array,
    type: PropTypes.string,
  }),
  name: PropTypes.string,
};

GeometryField.defaultProps = {
  formData: {
    coordinates: [],
    type: '',
  },
  name: undefined,
};

export default GeometryField;
