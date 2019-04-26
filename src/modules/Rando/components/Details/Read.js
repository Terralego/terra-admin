import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';
import { withNamespaces } from 'react-i18next';

const Read = ({ t, feature: { properties }, historyPush, paramLayer, paramId }) => {
  if (!Object.keys(properties).length) return null;
  const noFeature = t('rando.details.noFeature');
  return (
    <div className="details">
      <div className="details__header">
        <h2 className="details__title">{properties.name || noFeature}</h2>
        <Button
          onClick={() => historyPush(`/rando/map/layer/${paramLayer}/update/${paramId}`)}
          icon="edit"
        >
          Modifier
        </Button>
      </div>
      <div className="details_content">
        <h3 className="details__subtitle">{t('rando.details.informations')}</h3>
        <ul className="details__list">
          {Object.keys(properties).map(prop => (
            <li key={prop} className="details__list-item">
              <strong className="details__list-label">{prop}</strong>
              <span className={classnames('details__list-value', { 'details__list-value--empty': !properties[prop] })}>
                {properties[prop] || noFeature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default withNamespaces()(Read);
