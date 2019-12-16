import React from 'react';
import get from 'lodash.get';
import { withRouter } from 'react-router-dom';

// eslint-disable-next-line import/no-extraneous-dependencies
import { connect } from 'react-redux';

import DataLayerTabbedForm from './DataLayerTabbedForm';
import DataLayerExternalForm from './DataLayerExternalForm';
import DataLayerFormToolbar from './DataLayerFormToolbar';

import compose from '../../../../utils/compose';

const sanitizeProps = ({
  staticContext,
  ...props
}) => props;

const DataLayerFormSelector = ({
  external = false,
  component: Component = external ? DataLayerExternalForm : DataLayerTabbedForm,
  ...props
}) => <Component {...sanitizeProps(props)} toolbar={<DataLayerFormToolbar />} />;

const mapStateToProps = state => ({
  external: get(state, 'form.record-form.values.external'),
});

export default compose(
  withRouter,
  connect(mapStateToProps),
)(DataLayerFormSelector);
