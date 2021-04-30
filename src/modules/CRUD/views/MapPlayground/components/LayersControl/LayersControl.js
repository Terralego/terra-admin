import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Checkbox, Position } from '@blueprintjs/core';
import Api from '@terralego/core/modules/Api';

import AbstractMapControl from '@terralego/core/modules/Map/helpers/AbstractMapControl';
import Tooltip from '@terralego/core/components/Tooltip';
import { toast } from '../../../../../../utils/toast';

import './styles.scss';

export class LayersControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-layers';

  static propTypes = {
    layers: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    relations: PropTypes.arrayOf(
      PropTypes.shape({}),
    ),
    getMapStyle: PropTypes.func,
  }

  static defaultProps = {
    layers: [],
    relations: [],
    getMapStyle () {},
    onChange () {},
  }

  state = {
    orderedRelations: [],
  }

  componentDidMount () {
    const { layers = [], map } = this.props;
    layers.forEach(({ id }) => {
      this.setLayoutProperty(id, map.getLayoutProperty(id, 'visibility') === 'visible');
    });
    this.orderedRelations();
  }

  componentDidMUpdate ({ relations: prevRelations }) {
    const { relations } = this.props;
    if (prevRelations !== relations) {
      this.orderedRelations();
    }
  }

  componentWillUnmount () {
    const { map, relations } = this.props;
    relations.forEach(({ crud_view_pk: id }) => {
      const layerId = this.getRelationLayerID(id);
      if (map.getSource(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
  }

  orderedRelations = () => {
    const { map, relations } = this.props;
    const orderedRelations = relations
      .sort((a, b) => a.order - b.order)
      .map(({ label, crud_view_pk: id, geojson, empty = false }) => {
        const layerId = this.getRelationLayerID(id);
        const defaultChecked = map.getSource(layerId) && map.getLayoutProperty(layerId, 'visibility') === 'visible';
        return {
          defaultChecked,
          disabled: empty,
          geojson,
          id,
          label,
        };
      });
    this.setState({ orderedRelations });
  }

  onChange = ({ target: { value, checked } }) => {
    this.setLayoutProperty(value, checked);
  }

  getRelationLayerID = id => {
    const { featureID } = this.props;
    return `CRUD-${featureID}-relation-${id}`;
  }

  onChangeRelation = async ({ target: { value, checked } }, geojson) => {
    const { map, getMapStyle, layers } = this.props;
    const currentSourceAndLayerID = this.getRelationLayerID(value);
    if (!checked) {
      map.setLayoutProperty(currentSourceAndLayerID, 'visibility', 'none');
      return;
    }
    if (!map.getSource(currentSourceAndLayerID)) {
      let data = {};
      try {
        const request = await Api.request(geojson.replace('/api/', ''));
        data = request.results;
      } catch (e) {
        toast.displayError(e.message);
        return;
      }
      map.addSource(currentSourceAndLayerID, {
        type: 'geojson',
        data,
      });
      map.addLayer({
        id: currentSourceAndLayerID,
        source: currentSourceAndLayerID,
        ...getMapStyle(Number(value)),
      }, layers?.[0].id);
    }
    map.setLayoutProperty(currentSourceAndLayerID, 'visibility', 'visible');
  }

  setLayoutProperty = (layerId, isVisible) => {
    const { map } = this.props;
    map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
  }

  onClosing = () => {
    this.forceUpdate();
  }

  render () {
    const { layers, map, translate } = this.props;
    const { orderedRelations } = this.state;

    if (!layers.length && !orderedRelations.length) {
      return null;
    }

    return (
      <Tooltip
        content={translate('CRUD.map.controls.layers.label')}
        className="layerGroup"
      >
        <Popover
          className="popoverPos"
          onClosing={this.onClosing}
          position={Position.BOTTOM_LEFT}
          content={(
            <div className="radioGroup layerGroup__item">
              {layers.map(({ title, id, empty = false }) => {
                const defaultChecked = !empty && map.getLayoutProperty(id, 'visibility') === 'visible';
                return (
                  <Checkbox
                    className="bgLayer-radio"
                    defaultChecked={defaultChecked}
                    disabled={empty}
                    key={id}
                    onChange={this.onChange}
                    label={title}
                    value={id}
                  />
                );
              })}

              {orderedRelations.map(({ defaultChecked, disabled, geojson, id, label }) => (
                <Checkbox
                  className="bgLayer-radio"
                  defaultChecked={defaultChecked}
                  disabled={disabled}
                  key={id}
                  onChange={event => this.onChangeRelation(event, geojson)}
                  label={label}
                  value={id}
                />
              ))}
            </div>
          )}
        >
          <button
            className="mapboxgl-ctrl-icon"
            type="button"
            aria-label={translate('CRUD.map.controls.layers.label')}
          >
            <Icon icon="multi-select" />
          </button>
        </Popover>
      </Tooltip>

    );
  }
}

export default LayersControl;
