import React from 'react';
import { Link } from 'react-router-dom';
import { TopToolbar, Button } from 'react-admin';

import IconArrowBack from '@material-ui/icons/ArrowBack'; // eslint-disable-line import/no-extraneous-dependencies
import IconList from '@material-ui/icons/List'; // eslint-disable-line import/no-extraneous-dependencies

const DefaultActions = ({
  basePath,
  redirect,
}) => (
  <TopToolbar>
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
  </TopToolbar>
);

export default DefaultActions;
