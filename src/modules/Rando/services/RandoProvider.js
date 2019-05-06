import React from 'react';
import connect from 'mc-tf-test/utils/connect';
import { fetchMapConfig, fetchAllLayers } from './map';
import { fetchFeaturesList, fetchFeature, saveFeature } from './features';

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

  getFeature = async (layerId, featureId) => {
    try {
      const currentFeature = await fetchFeature(layerId, featureId);
      this.setState({ currentFeature });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.currentFeature.length]: true },
      }));
    }
  }

  saveFeatureAction = async (layerId, featureId, data) => {
    try {
      const currentFeature = await saveFeature(layerId, featureId, data);
      this.setState({
        currentFeature,
        error: {},
      });
      return currentFeature;
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.currentFeature.length]: true },
      }));
      return e;
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
      getFeature,
      saveFeatureAction,
      setMap,
      resizingMap,
    } = this;
    const value = {
      ...this.state,
      getMapConfig,
      getAllLayersAction,
      getFeaturesList,
      getFeature,
      saveFeatureAction,
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
