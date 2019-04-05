import React from 'react';
import classnames from 'classnames';
import { Button } from '@blueprintjs/core';
import MarkdownRenderer from 'mc-tf-test/modules/Template/MarkdownRenderer';

import './styles.scss';

const Details = ({
  feature: { properties } = {},
  visible,
  interaction: { template } = {},
  onClose = () => null,
}) => (
  <div className={classnames('rando-details', { 'rando-details--visible': visible })}>
    <div className="rando-details__close">
      <Button
        type="button"
        className="rando-details__close-button"
        onClick={onClose}
        icon="cross"
        minimal
      />
    </div>
    <div className="rando-details__content">
      <MarkdownRenderer
        template={template}
        {...properties}
      />
    </div>
  </div>
);

export default Details;
