import React from 'react';
import classnames from 'classnames';
import { withNamespaces } from 'react-i18next';

import { connectRandoProvider } from '../../services/RandoProvider';

export class Read extends React.Component {
  componentDidMount () {
    this.getData();
  }

  componentDidUpdate ({ layer: prevLayer, id: prevId }) {
    const { layer, id } = this.props;
    if (prevLayer !== layer || prevId !== id) {
      this.getData();
    }
  }

  getData () {
    const { layersList, layer, id, getFeature } = this.props;
    if (layersList && layer && id) {
      const [{ id: layerId }] = layersList.filter(({ name }) => name === layer);
      getFeature(layerId, id);
    }
  }

  render () {
    const { t, map, feature } = this.props;
    if (!map || !feature) return <div>Loading...</div>;
    const { properties } = feature;

    if (!Object.keys(properties).length) return null;
    const noFeature = t('rando.details.noFeature');

    return (
      <div className="details">
        <h2 className="details__title">{properties.name || noFeature}</h2>
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
  }
}
export default withNamespaces()(connectRandoProvider('map', 'getFeature', 'feature', 'layersList')(Read));
