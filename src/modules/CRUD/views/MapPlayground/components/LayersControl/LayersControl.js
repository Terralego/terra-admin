import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Checkbox, Position } from '@blueprintjs/core';

import AbstractMapControl from '@terralego/core/modules/Map/helpers/AbstractMapControl';
import Tooltip from '@terralego/core/components/Tooltip';

import './styles.scss';

export class LayersControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-layers';

  static propTypes = {
    layers: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
  }

  static defaultProps = {
    onChange () {},
  }

  componentDidMount () {
    const { layers, map } = this.props;
    layers.forEach(({ id }) => {
      this.setLayoutProperty(id, map.getLayoutProperty(id, 'visibility') === 'visible');
    });
  }

  onChange = ({ target: { value, checked } }) => {
    this.setLayoutProperty(value, checked);
  }

  setLayoutProperty = (layerId, isVisible) => {
    const { map } = this.props;
    map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
  }

  onClosing = () => {
    this.forceUpdate();
  }

  render () {
    const { layers = [], map, translate } = this.props;
    const { onChange } = this;

    if (!layers.length) {
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
              {layers.map(({ title, id }) => {
                const defaultChecked = map.getLayoutProperty(id, 'visibility') === 'visible';
                return (
                  <Checkbox
                    className="bgLayer-radio"
                    key={id}
                    label={title}
                    value={id}
                    onChange={onChange}
                    defaultChecked={defaultChecked}
                  />
                );
              })}
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
