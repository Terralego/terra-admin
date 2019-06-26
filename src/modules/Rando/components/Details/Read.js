import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';

import Actions from './Actions';

const NO_FEATURE = 'rando.details.noFeature';

// eslint-disable-next-line react/no-array-index-key
const formattedProp = value => value.split('\n').map((item, i) => (<React.Fragment key={i}>{item} <br /></React.Fragment>));

const Read = ({
  t,
  match: { params: { layer, id } },
  schema: { properties },
}) => {
  if (!properties) return null;
  const { name: { default: title } = {} } = properties;

  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{title || t(NO_FEATURE)}</h2>
      </div>
      <div className="details__content">
        <h3 className="details__subtitle">{t('rando.details.informations')}</h3>
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
      <Actions id={id} layer={layer} displayUpdate displayDelete />
    </div>
  );
};
export default withRouter(withNamespaces()(Read));
