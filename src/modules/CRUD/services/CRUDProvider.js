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
    feature: {},
    mapConfig: {},
    errors: {
      settings: undefined,
      featuresList: [],
      feature: [],
    },
  };

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setMap = map => !this.isUnmount && this.setState({ map });

  getMapConfig = async () => {
    const { results: mapConfig, error } = await fetchMapConfig();
    this.setState(state => ({
      mapConfig,
      errors: {
        ...state.errors,
        mapConfig: error,
      },
    }));
    return mapConfig;
  };

  getSettings = async () => {
    const { settings, error } = await fetchSettings();
    this.setState(state => ({
      settings,
      errors: {
        ...state.errors,
        settings: error,
      },
    }));
    return settings;
  }

  getFormattedError = props => {
    const {
      store,
      error,
      ids,
    } = props;
    const { errors: { [store]: errorStore } } = this.state;

    const propsFromIds = Object.keys(ids);

    if (!Object.keys(error).length) {
      return errorStore.filter(item => (
        propsFromIds.every(prop => item[prop] !== ids[prop])
      ));
    }

    return [...errorStore, error];
  }

  getFeaturesList = async layerId => {
    const { featuresList, error } = await fetchFeaturesList(layerId);
    const { errors } = this.state;

    this.setState({
      featuresList,
      errors: {
        ...errors,
        featuresList: this.getFormattedError({ error, ids: { layerId }, store: 'featuresList' }),
      },
    });

    return featuresList;
  };

  fetchFeature = async (layerId, featureId) => {
    const { feature, error } = await fetchFeatureAction(layerId, featureId);
    const { errors } = this.state;

    this.setState(state => ({
      feature: (!feature.identifier)
        ? { ...state.feature }
        : { ...state.feature, [feature.identifier]: feature },
      errors: {
        ...errors,
        feature: this.getFormattedError({ error, ids: { layerId, featureId }, store: 'feature' }),
      },
    }));

    return feature;
  }

  saveFeature = async (layerId, featureId, data) => {
    const { feature, error } = await saveFeatureAction(layerId, featureId, data);
    const { errors, featuresList: prevFeaturesList } = this.state;

    const isFeatureAlreadyExists = prevFeaturesList.some(({ identifier }) => (
      identifier === feature.identifier
    ));

    const featuresList = isFeatureAlreadyExists
      ? prevFeaturesList.map(item => (item.identifier === feature.identifier ? feature : item))
      : [...prevFeaturesList, (feature.identifier) && feature].filter(Boolean);

    this.setState(state => ({
      feature: (!feature.identifier)
        ? { ...state.feature }
        : { ...state.feature, [feature.identifier]: feature },
      featuresList,
      errors: {
        ...errors,
        feature: this.getFormattedError({ error, ids: { layerId, featureId }, store: 'feature' }),
      },

    }));

    return feature;
  }

  deleteFeature = async (layerId, featureId) => {
    const { feature, error } = await deleteFeatureAction(layerId, featureId);
    const {
      errors,
      featuresList,
      feature: { [featureId]: featureToDelete, ...featuresRest },
    } = this.state;

    this.setState(state => ({
      feature: feature === null
        ? state.feature
        : featuresRest,
      featuresList: feature === null
        ? state.featuresList
        : featuresList.filter(({ identifier }) => identifier !== featureId),
      errors: {
        ...errors,
        feature: this.getFormattedError({ error, ids: { layerId, featureId }, store: 'feature' }),
      },
    }));

    return feature;
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
