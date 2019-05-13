import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Icon } from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

import { withNamespaces } from 'react-i18next';

const NO_FEATURE = 'rando.details.noFeature';

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
        <NavLink to={`/rando/map/${layer}/${id}/update`}>
          <span className="bp3-button">
            <Icon icon="edit" />
            <span className="bp3-button-text"> {t('rando.details.update')}</span>
          </span>
        </NavLink>
      </div>
      <div className="details_content">
        <h3 className="details__subtitle">{t('rando.details.informations')}</h3>
        <ul className="details__list">
          {Object.keys(properties).map(prop => (
            <li key={prop} className="details__list-item">
              <strong className="details__list-label">{properties[prop].title || prop}</strong>
              <span className={classnames('details__list-value', { 'details__list-value--empty': !properties[prop].default })}>
                {properties[prop].default || t(NO_FEATURE)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default withRouter(withNamespaces()(Read));
