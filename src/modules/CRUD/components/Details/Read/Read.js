import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Header from '../Header';
import Menu from '../Menu';
import DefaultView from './DefaultView';
import GeomView from './GeomView';
import AttachmentView from './AttachmentView';

const Read = ({
  t,
  match: { params: { layer, section = 'default' } },
  displayViewFeature,
  feature: {
    title = t('CRUD.details.noFeature'),
    documents,
    geometries,
    display_properties: properties,
  },
  ...rest
}) => {
  if (!displayViewFeature) {
    toast.displayError(t('CRUD.details.noAccess'));
    return (<Redirect to={generateURI('layer', { layer })} />);
  }

  const getView = () => {
    switch (section) {
      case 'attachmentImages':
      case 'attachmentFiles':
        return <AttachmentView />;
      case 'geometries':
        return <GeomView geometries={geometries} {...rest} />;
      default:
        return <DefaultView properties={properties} />;
    }
  };

  return (
    <div className="details">
      <Header title={title} documents={documents} />
      <Menu section={section} />
      <div className="details__content">
        {getView()}
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
  },
  t: text => text,
};

export default Read;
