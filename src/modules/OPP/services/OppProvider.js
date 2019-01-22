import React from 'react';
import connect from 'mc-tf-test/utils/connect';
import Api from 'mc-tf-test/modules/Api';

export const context = React.createContext({});
export const connectOppProvider = connect(context);

const { Provider } = context;

const HEADERS = {};

export class OppProvider extends React.Component {
  state = {
    viewpointsList: [],
    viewpoints: {},
    errors: {},
  };

  getViewpoint = id => {
    const { viewpoints } = this.state;

    return viewpoints.find(({ id: vId }) => vId === +id);
  };

  fetchViewpoints = async () => {
    try {
      const viewpoints = await Api.request('viewpoints/');
      this.setState({ viewpointsList: viewpoints.results });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.viewpointsList.length]: true },
      }));
    }
  };

  fetchViewpoint = async id => {
    try {
      const viewpoint = await Api.request(`viewpoints/${id}`);
      this.setState(state => ({
        ...state,
        viewpoints: {
          ...state.viewpoints,
          [id]: viewpoint,
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [id]: true },
      }));
    }
  };

  fetchViewpointPut = async (id, viewpointEdit) => {
    try {
      const viewpointPut = await Api.request(`viewpoints/${id}`, { method: 'PUT', body: viewpointEdit });
      this.setState(state => ({
        ...state,
        viewpoints: {
          ...state.viewpoints,
          [id]: viewpointPut,
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [id]: true },
      }));
    }
  };

  fetchViewpointPutFormData = async (id, viewpointEdit) => {
    try {
      const viewpointPut = await Api.request(`viewpoints/${id}`, { method: 'PUT', body: viewpointEdit, headers: HEADERS });
      this.setState(state => ({
        ...state,
        viewpoints: {
          ...state.viewpoints,
          [id]: viewpointPut,
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [id]: true },
      }));
    }
  };

  render () {
    const { children } = this.props;
    const {
      getViewpoint,
      fetchViewpoints,
      fetchViewpoint,
      fetchViewpointPut,
      fetchViewpointPutFormData,
    } = this;
    const value = {
      ...this.state,
      getViewpoint,
      fetchViewpoints,
      fetchViewpoint,
      fetchViewpointPut,
      fetchViewpointPutFormData,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default OppProvider;
