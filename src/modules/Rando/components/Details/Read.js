import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';

import Actions from './Actions';

const NO_FEATURE = 'rando.details.noFeature';

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
  match: { params: { layer, id } },
  schema: { properties = {} },
}) => {
  const { name: { default: title } = {} } = properties;
  const hasProperties = !!Object.keys(properties).length;

  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{title || t(NO_FEATURE)}</h2>
      </div>
      {hasProperties && (
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
      )}
      <Actions paramId={id} paramLayer={layer} displayUpdate displayDelete />
    </div>
  );
};
export default withRouter(withNamespaces()(Read));
