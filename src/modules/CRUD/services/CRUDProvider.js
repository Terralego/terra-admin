import React from 'react';
import connect from 'react-ctx-connect';
import { fetchMapConfig } from './map';
import { fetchSettings } from './CRUD';
import {
  fetchFeaturesList,
  fetchFeature as fetchFeatureAction,
  saveFeature as saveFeatureAction,
  deleteFeature as deleteFeatureAction,
} from './features';

export const context = React.createContext({});
export const connectCRUDProvider = connect(context);

const { Provider } = context;

export class CRUDProvider extends React.Component {
  state = {
    settings: {},
    featuresList: [],
    mapConfig: {},
    errors: {
      featuresList: [],
      feature: [],
    },
  };

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setMap = map => !this.isUnmount && this.setState({ map });

  getMapConfig = async () => {
    try {
      const { results: mapConfig } = await fetchMapConfig();
      this.setState({ mapConfig });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, message: e.message },
      }));
    }
  };

  getSettings = async () => {
    try {
      const settings = await fetchSettings();
      this.setState({ settings });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, message: e.message },
      }));
    }
  }

  getFeaturesList = async layerId => {
    if (!layerId) {
      return;
    }
    try {
      const { results: featuresList } = await fetchFeaturesList(layerId);
      this.setState(state => ({
        ...state,
        featuresList,
        errors: {
          ...state.errors,
          featuresList: state.errors.featuresList.filter(item => !item[layerId]),
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: {
          ...state.errors,
          featuresList: [
            ...state.errors.featuresList,
            { [layerId]: { message: e.message } },
          ],
        },
      }));
    }
  }

  fetchFeature = async (layerId, featureId) => {
    if (!layerId || !featureId) {
      return;
    }
    try {
      const feature = await fetchFeatureAction(layerId, featureId);
      this.setState(state => ({
        feature: {
          ...state.feature,
          [feature.identifier]: feature,
        },
        errors: {
          ...state.errors,
          feature: state.errors.feature.filter(item => !item[featureId]),
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: {
          ...state.errors,
          feature: [
            ...state.errors.feature,
            { [featureId]: { message: e.message } },
          ],
        },
      }));
    }
  }

  saveFeature = async (layerId, featureId, data) => {
    if (!layerId) {
      return null;
    }
    try {
      const feature = await saveFeatureAction(layerId, featureId, data);
      const { featuresList } = this.state;
      const featureAlreadyExists = featuresList.some(({ identifier }) =>
        identifier === feature.identifier);

      this.setState(state => ({
        feature: {
          ...state.feature,
          [feature.identifier]: feature,
        },
        featuresList: featureAlreadyExists
          ? featuresList.map(item => (item.identifier === feature.identifier ? feature : item))
          : [...featuresList, feature],
      }));
      return feature;
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [featureId]: e.message },
      }));
      return null;
    }
  }

  deleteFeature = async (layerId, featureId) => {
    if (!layerId || !featureId) {
      return null;
    }
    try {
      const { feature, featuresList } = this.state;
      const deletion = await deleteFeatureAction(layerId, featureId);
      this.setState({
        feature: Object.keys(feature).reduce(
          (list, id) => (
            (id === featureId)
              ? list
              : { ...list, [id]: feature[id] }), {},
        ),
        featuresList: featuresList.filter(({ identifier }) => identifier !== featureId),
      });
      return deletion;
    } catch (e) {
      return null;
    }
  }

  resizingMap = () => {
    const { map } = this.state;
    if (!map) return;
    this.setState({ mapIsResizing: true });
    setTimeout(() => {
      map.resize();
      if (this.isUnmount) return;
      this.setState({ mapIsResizing: false });
    }, 300);
  }

  render () {
    const { children } = this.props;

    const {
      getMapConfig,
      getSettings,
      getFeaturesList,
      fetchFeature,
      saveFeature,
      deleteFeature,
      setMap,
      resizingMap,
    } = this;
    const value = {
      ...this.state,
      getMapConfig,
      getSettings,
      getFeaturesList,
      fetchFeature,
      saveFeature,
      deleteFeature,
      setMap,
      resizingMap,
    };

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default CRUDProvider;
