import React from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';

import Read from './Read';
import './styles.scss';

const Details = ({
  visible,
  history: { push }, match: { params: { layer, id } },
}) => (
  <div className={classnames('rando-details', { 'rando-details--visible': visible })}>
    <div className="rando-details__close">
      <Button
        type="button"
        className="rando-details__close-button"
        onClick={() => push(`/rando/map/layer/${layer}`)}
        icon="cross"
        minimal
      />
    </div>
    <div className="rando-details__content">
      <Read layer={layer} id={id} />
    </div>
  </div>
);

export default withRouter(Details);
