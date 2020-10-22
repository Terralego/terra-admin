import React from 'react';
import connect from 'react-ctx-connect';
import { fetchSettings } from './CRUD';
import {
  fetchFeaturesList,
  fetchFeature as fetchFeatureAction,
  saveFeature as saveFeatureAction,
  deleteFeature as deleteFeatureAction,
  updateFeatureIdentifier,
  fetchCustomEndpoint,
} from './features';

import { saveAttachmentCategories } from './attachments';

export const CRUDContext = React.createContext({});
export const connectCRUDProvider = connect(CRUDContext);

const { Provider } = CRUDContext;

export class CRUDProvider extends React.Component {
  state = {
    settings: undefined,
    featuresList: {},
    feature: {},
    mapConfig: undefined,
    errors: {
      attachmentCategories: undefined,
      settings: undefined,
      featuresList: [],
      feature: [],
    },
  };

  dataTableRef = React.createRef();

  detailsRef = React.createRef();

  componentWillUnmount () {
    this.isUnmount = true;
  }

  setMap = map => !this.isUnmount && this.setState({ map });

  getSettings = async endpoint => {
    const result = {};
    try {
      const settings = await fetchSettings(endpoint);
      result.settings = settings;
    } catch (e) {
      result.error = e;
    }

    const { settings = {}, error } = result;

    this.setState(({ errors }) => ({
      settings,
      errors: {
        ...errors,
        settings: error,
      },
    }));

    return settings;
  }

  getFormattedError = ({
    store,
    error,
    ids,
  }) => {
    const { errors: { [store]: errorStore } } = this.state;

    const propsFromIds = Object.keys(ids);

    // Remove error if it was before in the store
    if (!(error instanceof Error)) {
      return errorStore.filter(errorItem => (
        propsFromIds.every(prop => errorItem[prop] !== ids[prop])
      ));
    }

    // Modify error if it was before in the store
    const isErrorItemAlreadyExisting = errorStore.some(errorItem => (
      propsFromIds.every(prop => errorItem[prop] === ids[prop])
    ));

    if (isErrorItemAlreadyExisting) {
      return errorStore.map(errorItem => (
        propsFromIds.every(prop => errorItem[prop] === ids[prop])
          ? { error, ...ids }
          : errorItem
      ));
    }

    // Else add error in the store
    return [...errorStore, { error, ...ids }];
  }

  getFeaturesList = async (layerId, querystring) => {
    const result = {};
    try {
      const featuresList = await fetchFeaturesList(layerId, querystring);
      result.featuresList = featuresList;
    } catch (e) {
      result.error = e;
    }
    const { featuresList = [], error = {} } = result;

    this.setState(({ errors }) => ({
      featuresList,
      errors: {
        ...errors,
        featuresList: this.getFormattedError({ error, ids: { layerId }, store: 'featuresList' }),
      },
    }));
    return featuresList.length && featuresList;
  };

  fetchFeature = async (layerId, featureId) => {
    const result = {};
    try {
      const feature = await fetchFeatureAction(layerId, featureId);
      result.feature = feature;
    } catch (e) {
      result.error = e;
    }

    const { feature: newFeature = {}, error = {} } = result;

    this.setState(({ errors, feature }) => ({
      feature: updateFeatureIdentifier(feature, newFeature),
      errors: {
        ...errors,
        feature: this.getFormattedError({ error, ids: { layerId, featureId }, store: 'feature' }),
      },
    }));

    return Object.keys(newFeature).length > 0 && newFeature;
  }

  saveFeature = async (layerId, featureId, data, method = 'PUT') => {
    const result = {};
    try {
      const feature = await saveFeatureAction(layerId, featureId, data, method);
      result.feature = feature;
    } catch (e) {
      result.error = e;
    }

    const { feature: newFeature = {}, error = {} } = result;

    this.setState(({ errors, feature }) => ({
      feature: updateFeatureIdentifier(feature, newFeature),
      errors: {
        ...errors,
        feature: this.getFormattedError({ error, ids: { layerId, featureId }, store: 'feature' }),
      },
    }));

    return Object.keys(newFeature).length > 0 && newFeature;
  }

  deleteFeature = async (layerId, featureId) => {
    const result = {};
    try {
      await deleteFeatureAction(layerId, featureId);
      result.feature = featureId;
    } catch (e) {
      // Error
    }
    const { feature } = result;

    this.setState(({ featuresList, feature: { [feature]: deletedFeature, ...rest } }) => ({
      feature: rest,
      featuresList: {
        ...featuresList,
        results: deletedFeature
          ? featuresList.results.filter(({ identifier }) => identifier !== featureId)
          : featuresList.results,
      },
    }));

    return feature;
  }

  getAttachmentCategories = async endpoint => {
    const { attachmentCategories } = this.state;
    if (attachmentCategories) {
      return attachmentCategories;
    }
    const result = {};
    try {
      const categories = await fetchCustomEndpoint(endpoint);
      result.attachmentCategories = categories;
    } catch (e) {
      result.error = e;
    }

    const { attachmentCategories: nextAttachmentCategories, error } = result;

    this.setState(({ errors }) => ({
      attachmentCategories: nextAttachmentCategories,
      errors: {
        ...errors,
        attachmentCategories: error,
      },
    }));

    return nextAttachmentCategories;
  }

  createAttachmentCategories = async name => {
    const result = {};
    try {
      const category = await saveAttachmentCategories(name);
      result.category = category;
    } catch (e) {
      result.error = e;
    }

    const { category: newCategory = {}, error = {} } = result;

    this.setState(({ errors, attachmentCategories }) => ({
      attachmentCategories: {
        ...attachmentCategories,
        newCategory,
      },
      errors: {
        ...errors,
        attachmentCategories: {
          ...attachmentCategories.error,
          error,
        },
      },
    }));

    return Object.keys(newCategory).length > 0 && newCategory;
  }

  findOrCreateAttachmentCategory = async category => {
    const { name, id } = category;
    if (id !== null) {
      return category;
    }
    const {
      attachmentCategories,
      settings: {
        config: {
          attachment_categories: endpoint,
        },
      },
    } = this.state;
    let categories = attachmentCategories;
    if (!categories) {
      const { results } = await this.getAttachmentCategories(endpoint);
      categories = results;
    }
    const categoryInList = categories.find(({ name: categoryName }) => (
      categoryName.toLowerCase() === name.trim().toLowerCase()
    ));
    if (categoryInList !== undefined) {
      return categoryInList;
    }
    const newCategory = await this.createAttachmentCategories({ name });
    return newCategory;
  }

  render () {
    const { children } = this.props;

    const {
      dataTableRef,
      detailsRef,
      getMapConfig,
      getSettings,
      getFeaturesList,
      fetchFeature,
      saveFeature,
      deleteFeature,
      getAttachmentCategories,
      findOrCreateAttachmentCategory,
      setMap,
    } = this;
    const value = {
      ...this.state,
      dataTableRef,
      detailsRef,
      getMapConfig,
      getSettings,
      getFeaturesList,
      fetchFeature,
      saveFeature,
      deleteFeature,
      getAttachmentCategories,
      findOrCreateAttachmentCategory,
      setMap,
    };

    return (
      <Provider value={value}>
        {children}
      </Provider>
    );
  }
}

export default CRUDProvider;
