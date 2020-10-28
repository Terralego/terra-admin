import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Icon, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { MapContext } from '../../../services/MapProvider';
import { getBounds } from '../../../services/features';

import { generateURI } from '../../../config';

import NavIcon from '../NavIcon';

const NavAddFeature = ({ withPopover, children }) => {
  const { t } = useTranslation();
  if (!withPopover) {
    return children;
  }

  return (
    <Popover
      content={t('CRUD.details.create')}
      interactionKind={PopoverInteractionKind.HOVER}
      position={Position.RIGHT}
      boundary="window"
    >
      {children}
    </Popover>
  );
};

const NavItem = ({
  displayAddFeature,
  extent,
  layer,
  minified,
  name,
  pictogram,
}) => {
  const { dataTableRef, map } = useContext(MapContext);

  const handleClick = useCallback(({ target }) => {
    const isActivePage = !!target.offsetParent.getAttribute('aria-current');
    if (!isActivePage || !map) {
      return;
    }
    const [w, s, e, n] = extent;
    const { current: dataTable } = dataTableRef;

    setTimeout(() => {
      map.resize();
      map.fitBounds(getBounds([[w, s], [e, n]]), {
        padding: {
          top: 20,
          right: 50,
          bottom: dataTable.offsetHeight + 20,
          left: 20,
        },
        duration: 0,
      });
    }, 600);
  }, [dataTableRef, extent, map]);

  return (
    <div className="CRUD-nav__action">
      <NavLink
        className="CRUD-nav__link"
        to={generateURI('layer', { layer: layer.name })}
        onClick={handleClick}
      >
        <span className="CRUD-nav__item-content">
          <span className="bp3-button bp3-minimal">
            {!minified && <NavIcon src={pictogram} />}
            <span className="bp3-button-text">{name}</span>
          </span>
        </span>
      </NavLink>
      {displayAddFeature && (
        <NavAddFeature withPopover={!minified}>
          <NavLink to={generateURI('layer', { layer: layer.name, id: 'create' })}>
            <span className="CRUD-nav__item-content">
              <span className="bp3-button bp3-minimal">
                <Icon icon="add" color="#666" />
              </span>
            </span>
          </NavLink>
        </NavAddFeature>
      )}
    </div>
  );
};

export default NavItem;

NavItem.propTypes = {
  name: PropTypes.string.isRequired,
  pictogram: PropTypes.string,
  layer: PropTypes.shape({
    name: PropTypes.string,
  }),
  minified: PropTypes.bool,
  displayAddFeature: PropTypes.bool,
};

NavItem.defaultProps = {
  pictogram: undefined,
  layer: {
    name: undefined,
  },
  minified: false,
  displayAddFeature: false,
};
