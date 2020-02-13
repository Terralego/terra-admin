import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Header from '../Header';
import Menu from '../Menu';
import DefaultView from './DefaultView';
import AttachmentView from './AttachmentView';

const Read = ({
  t,
  match: { params: { layer, section = 'default' } },
  displayViewFeature,
  feature: {
    title = t('CRUD.details.noFeature'),
    documents,
    display_properties: oldProperties,
    new_display_properties: properties = oldProperties,
  },
}) => {
  if (!displayViewFeature) {
    toast.displayError(t('CRUD.details.noAccess'));
    return (<Redirect to={generateURI('layer', { layer })} />);
  }

  return (
    <div className="details">
      <Header title={title} documents={documents} />
      <Menu section={section} />
      <div className="details__content">
        {section === 'default'
          ? <DefaultView properties={properties} />
          : <AttachmentView />
        }
      </div>
    </div>
  );
};

Read.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      section: PropTypes.string,
    }),
  }),
  displayViewFeature: PropTypes.bool,
  feature: PropTypes.shape({
    title: PropTypes.string,
    documents: PropTypes.array,
    display_properties: PropTypes.shape({}),
    new_display_properties: PropTypes.shape({}),
  }),
  t: PropTypes.func,
};

Read.defaultProps = {
  match: {
    params: {
      layer: undefined,
      section: undefined,
    },
  },
  displayViewFeature: true,
  feature: {
    title: '',
    documents: [],
    display_properties: {},
    new_display_properties: {},
  },
  t: text => text,
};

export default Read;
