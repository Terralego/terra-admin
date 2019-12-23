import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover, Checkbox, Position } from '@blueprintjs/core';

import AbstractMapControl from '@terralego/core/modules/Map/helpers/AbstractMapControl';
import Tooltip from '@terralego/core/components/Tooltip';

export class LayersControl extends AbstractMapControl {
  static containerClassName = 'mapboxgl-ctrl mapboxgl-ctrl-group mapboxgl-ctrl-layers';

  static propTypes = {
    layers: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
    onChange: PropTypes.func.isRequired,
  }

  onChange = ({ target: { value, checked } }) => {
    const { onChange, map } = this.props;
    onChange(value, checked);
    map.setLayoutProperty(value, 'visibility', checked ? 'visible' : 'none');
  }


  render () {
    const { layers = [], translate } = this.props;
    const { onChange } = this;

    if (!layers.length) {
      return null;
    }

    return (
      <Tooltip
        content={translate('CRUD.map.controls.layers.label')}
      >
        <button
          className="mapboxgl-ctrl-icon"
          type="button"
          aria-label={translate('CRUD.map.controls.layers.label')}
        >
          <Popover
            className="popoverPos"
            position={Position.BOTTOM_LEFT}
            content={(
              <div className="radioGroup">
                {layers.map(({ title, id, displayOnMap = true }) => (
                  <Checkbox
                    className="bgLayer-radio"
                    key={id}
                    label={title}
                    value={id}
                    onChange={onChange}
                    defaultChecked={displayOnMap}
                  />
                ))}
              </div>
          )}
          >
            <Icon icon="multi-select" />
          </Popover>
        </button>
      </Tooltip>

    );
  }
}

export default LayersControl;
