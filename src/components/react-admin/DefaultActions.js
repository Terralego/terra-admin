import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { CardActions, Button } from 'react-admin';

import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import IconList from '@material-ui/icons/List'; // eslint-disable-line import/no-extraneous-dependencies

import compose from '../../utils/compose';

const DefaultActions = ({
  basePath,
  location: { state: { redirect } = {} },
}) => (
  <CardActions>
    <Button
      component={Link}
      to={{
        pathname: redirect || basePath,
      }}
      variant="outlined"
      label={redirect ? 'ra.action.back' : 'ra.action.back-to-list'}
    >
      {redirect ? <IconArrowBack /> : <IconList />}
    </Button>
  </CardActions>
);

export default compose(withRouter)(DefaultActions);
