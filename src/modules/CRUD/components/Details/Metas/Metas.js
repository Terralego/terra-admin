import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon, Button } from '@blueprintjs/core';

import { generateURI } from '../../../config';

const Metas = ({ t, full, onSizeChange, match: { params: { layer } } }) => (
  <div className="CRUD-details__metas">
    <Button
      minimal
      icon={full ? 'minimize' : 'maximize'}
      onClick={onSizeChange}
    />
    <NavLink to={generateURI('layer', { layer })} title={t('CRUD.details.close')}>
      <span className="bp3-button bp3-minimal">
        <Icon icon="cross" />
      </span>
    </NavLink>
  </div>
);

Metas.propTypes = {
  full: PropTypes.bool,
  onSizeChange: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({
      layer: PropTypes.string,
    }),
  }),
  t: PropTypes.func,
};

Metas.defaultProps = {
  full: false,
  onSizeChange () {},
  match: {
    params: {
      layer: undefined,
    },
  },
  t: text => text,
};

export default Metas;
