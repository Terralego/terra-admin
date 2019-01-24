import React from 'react';
import connect from 'mc-tf-test/utils/connect';

import { fetchViewpoint, fetchAllViewpoints, editViewpoint, addImageToViewpoint } from './viewpoints';

export const context = React.createContext({});
export const connectOppProvider = connect(context);

const { Provider } = context;

export class OppProvider extends React.Component {
  state = {
    viewpointsList: [],
    viewpoints: {},
    errors: {},
  };

  getViewpoint = async id => {
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

  getAllViewpoints = async () => {
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

  saveViewpoint = async data => {
    if (!data.id) {
      // Creation
    } else {
      // Editing
      try {
        const viewpointEdited = await editViewpoint(data);
        this.setState(state => ({
          ...state,
          viewpoints: {
            ...state.viewpoints,
            [data.id]: viewpointEdited,
          },
        }));
      } catch (e) {
        this.setState(state => ({
          ...state,
          errors: { ...state.errors, [data.id]: true },
        }));
      }
    }
  };

  uploadPictureViewpoint = async data => {
    try {
      const viewpointFile = await addImageToViewpoint(data);
      this.setState(state => ({
        ...state,
        viewpoints: {
          ...state.viewpoints,
          [data.id]: viewpointFile,
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
    const { children } = this.props;
    const {
      getViewpoint,
      getAllViewpoints,
      saveViewpoint,
      uploadPictureViewpoint,
    } = this;
    const value = {
      ...this.state,
      getViewpoint,
      getAllViewpoints,
      saveViewpoint,
      uploadPictureViewpoint,
    };
    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default OppProvider;
