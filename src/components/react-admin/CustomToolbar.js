import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Button,
  DeleteWithConfirmButton,
  SaveButton,
  Toolbar,
} from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import { withStyles } from '@material-ui/core/styles';
import IconClose from '@material-ui/icons/Close';
/* eslint-enable */

import compose from '../../utils/compose';

const styles = {
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  filler: {
    flex: 1,
  },
};

/**
 * A custom toolbar that can be used in various form footer with
 * default redirect aware actions:
 * - A save button
 * - A cancel button
 * - A delete button
 */
const CustomToolbar = ({
  basePath,
  location: { state: { redirect } = {} } = {},
  classes,
  ...props
}) => (
  <Toolbar {...props} className={classes.toolbar}>
    <SaveButton redirect={redirect || 'show'} submitOnEnter />

    <div className={classes.filler} />

    <Button
      component={Link}
      to={{ pathname: redirect || basePath }}
      label="ra.action.cancel"
    >
      <IconClose />
    </Button>

    <DeleteWithConfirmButton redirect={redirect || 'show'} />
  </Toolbar>
);

export default compose(
  withRouter,
  withStyles(styles),
)(CustomToolbar);
