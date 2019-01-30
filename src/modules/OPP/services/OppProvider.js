import React from 'react';
import connect from 'mc-tf-test/utils/connect';

import { fetchViewpoint, fetchAllViewpoints, saveViewpoint, addImageToViewpoint } from './viewpoints';

export const context = React.createContext({});
export const connectOppProvider = connect(context);

const { Provider } = context;

export class OppProvider extends React.Component {
  state = {
    viewpointsList: [],
    viewpoints: {},
    errors: {},
  };

  getViewpointAction = async id => {
    try {
      const viewpoint = await fetchViewpoint(id);
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
        errors: { ...state.errors, [id]: true, code: e.message },
      }));
    }
  };

  getAllViewpointsAction = async () => {
    try {
      const allViewpoints = await fetchAllViewpoints();
      this.setState({ viewpointsList: allViewpoints.results });
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.viewpointsList.length]: true },
      }));
    }
  };

  saveViewpointAction = async data => {
    try {
      const viewpoint = await saveViewpoint(data);
      if (data.id) {
        this.setState(state => ({
          ...state,
          viewpoints: {
            ...state.viewpoints,
            [data.id]: viewpoint,
          },
        }));
      } else {
        this.setState(state => ({
          ...state,
          viewpoints: {
            ...state.viewpoints,
            newViewpoint: viewpoint,
          },
        }));
      }
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [data.id]: true },
      }));
    }
  };

  uploadPictureViewpointAction = async data => {
    try {
      const viewpoint = await addImageToViewpoint(data);
      this.setState(state => ({
        ...state,
        viewpoints: {
          ...state.viewpoints,
          [data.id]: viewpoint,
        },
      }));
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [data.id]: true },
      }));
    }
  };

  render () {
  console.log(this.state);
    const { children } = this.props;
    const {
      getViewpointAction,
      getAllViewpointsAction,
      saveViewpointAction,
      uploadPictureViewpointAction,
    } = this;
    const value = {
      ...this.state,
      getViewpointAction,
      getAllViewpointsAction,
      saveViewpointAction,
      uploadPictureViewpointAction,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default OppProvider;
