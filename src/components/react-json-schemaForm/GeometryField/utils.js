import Api from '@terralego/core/modules/Api';
import { toast } from '../../../utils/toast';

import { ACTION_CREATE, getView } from '../../../modules/CRUD/services/CRUD';

export const getCoordinatesFromGeometries = (features, isMultiGeometry) => {
  const featuresHasCompositesType =
    features.filter((item, index, array) => array.indexOf(item) === index)
      .length === 2;

  if (featuresHasCompositesType || isMultiGeometry) {
    return features.reduce(
      (list, { geometry: { type, coordinates } }) =>
        (type.startsWith('Multi')
          ? [...list, ...coordinates]
          : [...list, coordinates]),
      [],
    );
  }
  return features.flatMap(({ geometry: { coordinates } }) => coordinates);
};

export const getDirectionsThemes = ({ routingSettings, accessToken }) => {
  if (routingSettings.length === 0) {
    return [];
  }
  return routingSettings
    .map(({ label, provider: { options, name } }, index) => {
      if (name === 'mapbox' && !accessToken) {
        return null;
      }
      return {
        id: index,
        name: label,
        getPathByCoordinates: async coordinates => {
          if (name === 'mapbox') {
            const [from, to] = coordinates;
            const data = await fetch(
              `https://api.mapbox.com/directions/v5/mapbox/${options.transit}/${from};${to}?geometries=geojson&overview=full&access_token=${accessToken}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              },
            ).then(response => response.json());
            if (data?.code !== 'Ok') {
              toast.displayError(data.message);
              return null;
            }
            return {
              coordinates: data.routes[0].geometry.coordinates,
              waypoints: {
                departure: data.waypoints[0].location,
                arrival: data.waypoints[1].location,
              },
            };
          }

          let results = null;
          try {
            results = await Api.request(options.url.replace('/api/', ''), {
              method: 'POST',
              body: { geom: { type: 'LineString', coordinates } },
            });
          } catch (e) {
            toast.displayError(e.message);
          }

          if (!results) {
            return null;
          }

          const { way, waypoints } = results;
          const { coordinates: nextCoordinates = [] } = way || {};
          const [
            { coordinates: departure = null } = {},
            { coordinates: arrival = null } = {},
          ] = waypoints || [];
          return {
            coordinates: nextCoordinates,
            waypoints: {
              departure,
              arrival,
            },
          };
        },
      };
    })
    .filter(Boolean);
};

/**
 * Get geometries from
 * -settings informations if this is a new one
 * -   stored if this is an update
 *
 * @param {Object} {
 *   feature,
 *   formData,
 *   params,
 *   name,
 *   settings,
 * }
 * @returns an object wrapping
 * the name, identifier, and geometry
 */

export const getGeometries = ({
  feature,
  formData,
  params,
  name,
  settings,
}) => {
  const {
    layer,
    routingSettings,
  } = getView(settings, params.layer);
  if (params.id === ACTION_CREATE) {
    const { coordinates = [], type } = formData || {};
    return {
      geomType: layer.geom_type,
      geom: { coordinates, type },
      layerName: layer.name,
      properties: {},
      routingSettings,
    };
  }
  const {
    geometries: { [name]: { geom_type: geomType, geom, identifier } },
    properties = {},
  } = feature[params.id];

  return {
    identifier,
    layerName: name,
    geomType,
    geom,
    properties,
    routingSettings,
  };
};

export const getLayerId = (layers, name) => {
  const { id } =
    layers.find(({ 'source-layer': source }) => source === name) || {};
  return id;
};

export default { getCoordinatesFromGeometries, getDirectionsThemes, getGeometries, getLayerId };
