import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CardActions, ListButton } from 'react-admin';

import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import Button from '@material-ui/core/Button'; // eslint-disable-line import/no-extraneous-dependencies

import compose from '../../utils/compose';

const DefaultActions = ({
  basePath,
  location: { state: { referrer } = {} },
}) => (
  <CardActions>
    {!referrer && (
      <ListButton
        basePath={basePath}
        variant="outlined"
        label="ra.action.back-to-list"
      />
    )}
    {referrer && (
      <Button
        component={Link}
        to={{
          pathname: referrer,
        }}
        label="ra.action.back"
      >
        <IconArrowBack />
      </Button>
    )}
  </CardActions>
);

export default compose(withRouter)(DefaultActions);
