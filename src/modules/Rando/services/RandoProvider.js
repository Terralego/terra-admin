import React from 'react';
import connect from 'react-ctx-connect';
import { fetchMapConfig, fetchAllLayers } from './map';
import {
  fetchFeaturesList,
  fetchFeature as fetchFeatureAction,
  saveFeature as saveFeatureAction,
} from './features';

export const context = React.createContext({});
export const connectRandoProvider = connect(context);

const { Provider } = context;

export class RandoProvider extends React.Component {
  state = {
    layersList: [],
    featuresList: [],
    mapConfig: {},
  };

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setMap = map => !this.isUnmount && this.setState({ map });

  getMapConfig = async () => {
    try {
      const mapConfig = await fetchMapConfig();
      this.setState({ mapConfig: {
        ...mapConfig.results,
      } });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.mapConfig.length]: true },
      }));
    }
  };

  getAllLayersAction = async () => {
    try {
      const allLayers = await fetchAllLayers();
      this.setState({ layersList: allLayers });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.allLayers.length]: true },
      }));
    }
  };

  getFeaturesList = async layerId => {
    try {
      const featuresList = await fetchFeaturesList(layerId);
      this.setState({ featuresList });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.featuresList.length]: true },
      }));
    }
  }

  fetchFeature = async (layerId, featureId) => {
    try {
      const feature = await fetchFeatureAction(layerId, featureId);
      this.setState(state => ({
        feature: {
          ...state.feature,
          [feature.identifier]: feature,
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state[layerId].length]: true },
      }));
    }
  }

  saveFeature = async (layerId, featureId, data) => {
    try {
      const feature = await saveFeatureAction(layerId, featureId, data);
      this.setState(state => ({
        feature: {
          ...state.feature,
          [feature.identifier]: feature,
        },
      }));
      const { featuresList } = this.state;
      const isFeatureAlreadyExist = featuresList.some(({ identifier }) =>
        identifier === feature.identifier);

      if (isFeatureAlreadyExist) {
        this.setState({
          featuresList: featuresList.map(item =>
            (item.identifier === feature.identifier ? feature : item)),
        });
      } else {
        this.setState({
          featuresList: [...featuresList, feature],
        });
      }
      return feature;
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state[layerId].length]: true },
      }));
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
    }, 800);
  }

  render () {
    const { children } = this.props;

    const {
      getMapConfig,
      getAllLayersAction,
      getFeaturesList,
      fetchFeature,
      saveFeature,
      setMap,
      resizingMap,
    } = this;
    const value = {
      ...this.state,
      getMapConfig,
      getAllLayersAction,
      getFeaturesList,
      fetchFeature,
      saveFeature,
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

export default RandoProvider;
