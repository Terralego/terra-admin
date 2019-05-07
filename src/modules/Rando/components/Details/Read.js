import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

const Read = ({
  t,
  history: { push },
  match: { params: { layer, id } },
  schema: { properties },
}) => {
  if (!properties) return null;
  const defaultTitle = t('rando.details.noFeature');
  const { name: { default: title } = {} } = properties;

  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{title || defaultTitle}</h2>
        <Button
          onClick={() => push(`/rando/map/layer/${layer}/update/${id}`)}
          icon="edit"
        >
          {t('rando.details.edit')}
        </Button>
      </div>
      <div className="details_content">
        <h3 className="details__subtitle">{t('rando.details.informations')}</h3>
        <ul className="details__list">
          {Object.keys(properties).map(prop => (
            <li key={prop} className="details__list-item">
              <strong className="details__list-label">{properties[prop].title || prop}</strong>
              <span className={classnames('details__list-value', { 'details__list-value--empty': !properties[prop].default })}>
                {properties[prop].default || defaultTitle}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default withRouter(withNamespaces()(Read));
