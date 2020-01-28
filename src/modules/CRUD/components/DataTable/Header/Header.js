import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  Spinner,
} from '@blueprintjs/core';
import { NavLink } from 'react-router-dom';

import { generateURI } from '../../../config';
import Actions from '../Actions';

import './styles.scss';

const Header = ({
  columns,
  displayAddFeature,
  featuresList: { count } = {},
  match: { params: { layer } },
  onChange,
  onHeaderChange,
  layerName,
  t,
}) => (
  <div className="table-header">
    <div className="table-header__title">
      {count === undefined && <Spinner className="table-header__spinner" size={Spinner.SIZE_SMALL} tagName="span" />}
      <span>{t('CRUD.table.results', { count })}</span>
      <strong>{layerName}</strong>
      {displayAddFeature && (
        <NavLink className="table-header__create" to={generateURI('layer', { layer, action: 'create' })}>
          <span className="bp3-button bp3-minimal">
            <Icon icon="add" />
            <span className="bp3-button-text"> {t('CRUD.details.create')}</span>
          </span>
        </NavLink>
      )}
    </div>
    <Actions
      columns={columns}
      onHeaderChange={onHeaderChange}
      onChange={onChange}
    />
  </div>
);

Header.propTypes = {
  layerName: PropTypes.string,
  t: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
    }),
  }),
  displayAddFeature: PropTypes.bool,
  featuresList: PropTypes.shape({
    count: PropTypes.number,
  }),
};

Header.defaultProps = {
  layerName: '',
  t:  () => {},
  match: {},
  displayAddFeature: false,
  featuresList: {},
};

export default Header;
