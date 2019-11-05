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
      attachmentCategories: undefined,
      settings: undefined,
      featuresList: [],
      feature: [],
    },
  };

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

  getFormattedError = props => {
    const {
      store,
      error,
      ids,
    } = props;
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
      const { results: featuresList } = await fetchFeaturesList(layerId, querystring);
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

  saveFeature = async (layerId, featureId, data) => {
    const result = {};
    try {
      const feature = await saveFeatureAction(layerId, featureId, data);
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
      featuresList: deletedFeature
        ? featuresList.filter(({ identifier }) => identifier !== featureId)
        : featuresList,
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

  getAttachment = async (endpoint, featureID, type) => {
    const result = {};
    try {
      const attachement = await fetchCustomEndpoint(endpoint);
      result.attachment = attachement;
    } catch (e) {
      result.error = e;
    }

    const { attachment, error } = result;

    this.setState(({ errors, feature }) => ({
      feature: {
        ...feature,
        [featureID]: {
          ...feature[featureID],
          [type]: attachment,
        },
      },
      errors: {
        ...errors,
        attachmentCategories: error,
      },
    }));

    return attachment;
  }

  resizingMap = () => {
    const { map } = this.state;
    if (!map) return;
    map.resize();
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
      getAttachmentCategories,
      getAttachment,
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
      getAttachmentCategories,
      getAttachment,
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
