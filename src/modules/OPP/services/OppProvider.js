import React from 'react';
import connect from 'mc-tf-test/utils/connect';

import { fetchViewpoint, fetchViewpoints, saveViewpoint, addImageToViewpoint } from './viewpoints';

export const context = React.createContext({});
export const connectOppProvider = connect(context);

const { Provider } = context;

export class OppProvider extends React.Component {
  state = {
    viewpointsList: {
      current: {},
    },
    viewpoints: {},
    errors: {},
  };

  /**
   * Get a viewpoint according to id
   * @param id
   * @returns {Promise<void>}
   */
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

  /**
   * Get the first page of filtered viewpoints
   * Prevent page conflict when updating filters
   * @param data
   * @param page
   * @param itemsPerPage
   * @returns {Promise<boolean>}
   */
  getFirstPageFilteredViewpointsAction = async (data, itemsPerPage, page) => {
    try {
      const filteredViewpoints = await fetchViewpoints({
        data,
        page,
        itemsPerPage,
      });
      this.setState({
        viewpointsList: {
          current: filteredViewpoints,
          [page]: filteredViewpoints,
        },
        filters: data,
      });
      return true;
    } catch (e) {
      this.setState(state => ({
        ...state,
        errors: { ...state.errors, [state.viewpointsList.length]: true },
      }));
      return false;
    }
  };

  /**
   * Get viewpoints per page
   * @param itemsPerPage
   * @param page
   * @returns {Promise<void>}
   */
  getPaginatedViewpointsAction = async (itemsPerPage, page) => {
    const { viewpointsList: { [page]: existingViewpoints } } = this.state;
    if (existingViewpoints) {
      this.setState(prevState => ({
        viewpointsList: {
          ...prevState.viewpointsList,
          current: existingViewpoints,
        },
      }));
    } else {
      try {
        const currentPageViewpoints = await fetchViewpoints({ itemsPerPage, page });
        this.setState(prevState => ({
          viewpointsList: {
            ...prevState.viewpointsList,
            current: currentPageViewpoints,
            [page]: currentPageViewpoints,
          },
        }));
      } catch (e) {
        this.setState(state => ({
          ...state,
          errors: { ...state.errors, [state.viewpointsList.length]: true },
        }));
      }
    }
  };

  /**
   * Save a viewpoint
   * @param data
   * @returns {Promise<*|Promise<*>|Promise<*>>}
   */
  saveViewpointAction = async data => {
    try {
      const viewpoint = await saveViewpoint(data);
      this.setState(state => ({
        viewpoints: {
          ...state.viewpoints,
          [viewpoint.id]: viewpoint,
        },
      }));
      return viewpoint;
    } catch (e) {
      this.setState(state => ({
        errors: { ...state.errors, [data.id]: e },
      }));
      return e;
    }
  };

  /**
   * Upload a picture of a viewpoint
   * @param data
   * @returns {Promise<*>}
   */
  uploadPictureViewpointAction = async data => {
    try {
      const viewpoint = await addImageToViewpoint(data);
      this.setState(state => ({
        viewpoints: {
          ...state.viewpoints,
          [data.id]: viewpoint,
        },
      }));
      return viewpoint;
    } catch (e) {
      this.setState(state => ({
        errors: { ...state.errors, [data.id]: e },
      }));
      return e;
    }
  };

  render () {
    const { children } = this.props;
    const {
      getViewpointAction,
      getAllViewpointsAction,
      getPaginatedViewpointsAction,
      getFirstPageFilteredViewpointsAction,
      saveViewpointAction,
      uploadPictureViewpointAction,
    } = this;
    const value = {
      ...this.state,
      getViewpointAction,
      getAllViewpointsAction,
      getPaginatedViewpointsAction,
      getFirstPageFilteredViewpointsAction,
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
