import React, { useState, useEffect, useReducer, useCallback, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import PropTypes from 'prop-types';
import { getGeometries } from './utils';

import { ACTION_CREATE } from '../../../modules/CRUD/services/CRUD';
import { CRUDContext } from '../../../modules/CRUD/services/CRUDProvider';

import ImportGeomFile from '../../ImportGeomFile';

import MapInteraction from './MapInteraction';
import Informations from './Informations';
import './styles.scss';


function reducer (state, action) {
  return { ...state, ...action };
}

const GeometryField = ({
  formData,
  name,
  onChange,
  schema,
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

  const isRouting = formData.type === 'LineString' && geomValues.routingSettings.length && geomValues.isMainLayer;

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
  }, [params, geometries.geom?.type, isRouting]);

  useEffect(() => {
    setFormData({
      geom: geomValues.geom,
      ...(isRouting && { routingInformation: geomValues.routingInformation }),
    });
    return () => {
      setFormData({
        geom: geomValues.geom,
        ...(isRouting && { routingInformation: geomValues.routingInformation }),
      });
    };
  }, [geomValues.geom, geomValues.routingInformation, isRouting, params]);

  const importDraw = useCallback(nextFeatures => {
    setFeaturesToFitBounds(nextFeatures);
  }, []);

  useEffect(() => {
    onChange(nextFormData);
  }, [nextFormData, onChange]);

  const isRequired = schema.required?.includes('coordinates');

  return (
    <fieldset className="geometry-field">
      {isRequired && params.id !== ACTION_CREATE && (
        <span className="details__list-edit-mandatory details__list-edit-mandatory--edit">
          {t('CRUD.details.mandatory')}
        </span>
      )}
      <div className="geometry-field__col">
        <MapInteraction
          featuresToFitBounds={featuresToFitBounds}
          geomValues={geomValues}
          setFeaturesToFitBounds={setFeaturesToFitBounds}
          setFormData={setFormData}
        />
        <div className="form-group field">
          <div className="geometry-field__row">
            <Informations
              schema={schema}
              formData={nextFormData}
              isRequired={isRequired}
              isRouting={isRouting}
            />
          </div>
          <span className="geometry-field__or"><span>{t('jsonSchema.geometryField.or')}</span></span>
          <div className="geometry-field__row">
            <ImportGeomFile
              geomType={geomValues.geomType}
              hasDraws={Boolean(geomValues?.geom?.coordinates.length)}
              onSubmit={importDraw}
            />
          </div>
        </div>
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
