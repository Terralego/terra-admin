import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Header from '../Header';
import DefaultView from './DefaultView';

const Read = ({
  t,
  match: { params: { layer } },
  displayViewFeature,
  feature: {
    title = t('CRUD.details.noFeature'),
    documents,
    display_properties: properties,
  },
}) => {
  if (!displayViewFeature) {
    toast.displayError(t('CRUD.details.noAccess'));
    return (<Redirect to={generateURI('layer', { layer })} />);
  }

  return (
    <div className="details">
      <Header title={title} documents={documents} />
      <DefaultView properties={properties} />
    </div>
  );
};

Read.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
    }),
  }),
  displayViewFeature: PropTypes.bool,
  feature: PropTypes.shape({
    title: PropTypes.string,
    documents: PropTypes.array,
    display_properties: PropTypes.shape({}),
  }),
  t: PropTypes.func,
};

Read.defaultProps = {
  match: {
    params: {
      layer: undefined,
    },
  },
  displayViewFeature: true,
  feature: {
    title: '',
    documents: [],
    display_properties: {},
  },
  t: text => text,
};

export default Read;
