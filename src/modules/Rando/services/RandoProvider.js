import React from 'react';
import connect from 'mc-tf-test/utils/connect';
import { fetchMapConfig, fetchAllLayers } from './map';

export const context = React.createContext({});
export const connectRandoProvider = connect(context);

const { Provider } = context;

export class RandoProvider extends React.Component {
  state = {
    layersList: [],
    mapConfig: {},
  };

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
      this.setState({ layersList: allLayers.results });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.allLayers.length]: true },
      }));
    }
  };

  render () {
    const { children } = this.props;
    const {
      getMapConfig,
      getAllLayersAction,
    } = this;
    const value = {
      ...this.state,
      getMapConfig,
      getAllLayersAction,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default RandoProvider;
