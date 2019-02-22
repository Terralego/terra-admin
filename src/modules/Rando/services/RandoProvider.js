import React from 'react';
import connect from 'mc-tf-test/utils/connect';
import { fetchAllLayers } from './map';

export const context = React.createContext({});
export const connectRandoProvider = connect(context);

const { Provider } = context;

export class RandoProvider extends React.Component {
  state = {
    layersList: [],
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
      getAllLayersAction,
    } = this;
    const value = {
      ...this.state,
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
