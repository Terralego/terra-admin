import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import { toast } from '../../../../../utils/toast';
import { generateURI } from '../../../config';
import Templates from '../Templates';
import Actions from '../Actions';

const NO_FEATURE = 'CRUD.details.noFeature';

const formattedProp = value => {
  if (typeof value === 'string') {
    // eslint-disable-next-line react/no-array-index-key
    return value.split('\n').map((item, i) => (<React.Fragment key={i}>{item} <br /></React.Fragment>));
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return value;
};

const Read = ({
  t,
  match: { params: { layer: paramLayer, id: paramId } },
  schema: { properties = {} },
  displayViewFeature,
  layer: { templates },
  feature: { id },
}) => {
  if (!displayViewFeature) {
    toast.displayError(t('CRUD.details.noAccess'));
    return (<Redirect to={generateURI('layer', { layer: paramLayer })} />);
  }

  const { name: { default: title } = {} } = properties;
  const hasProperties = !!Object.keys(properties).length;

  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{title || t(NO_FEATURE)}</h2>
        <Templates id={id} files={templates} />
      </div>
      {hasProperties && (
        <div className="details__content">
          <h3 className="details__subtitle">{t('CRUD.details.informations')}</h3>
          <ul className="details__list">
            {Object.keys(properties).map(prop => (
              <li key={prop} className="details__list-item">
                <strong className="details__list-label">{properties[prop].title || prop}</strong>
                <span className={classnames('details__list-value', { 'details__list-value--empty': !properties[prop].default })}>
                  {formattedProp(properties[prop].default || t(NO_FEATURE))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Actions paramId={paramId} paramLayer={paramLayer} displayUpdate displayDelete />
    </div>
  );
};

Read.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
      id: PropTypes.string,
    }),
  }),
  schema: PropTypes.shape({
    properties: PropTypes.shape({}),
  }),
  displayViewFeature: PropTypes.bool,
  layer: PropTypes.shape({
    templates: PropTypes.array,
  }),
  feature: PropTypes.shape({
    id: PropTypes.number,
  }),
  t: PropTypes.func,
};

Read.defaultProps = {
  match: {
    params: {
      layer: undefined,
      id: undefined,
    },
  },
  schema: {
    properties: {},
  },
  displayViewFeature: true,
  layer: {
    templates: [],
  },
  feature: {
    id: undefined,
  },
  t: text => text,
};

export default Read;
