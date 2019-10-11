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
  cancel: {
    marginLeft: 'auto',
  },
};

const CancelButton = ({ redirect, className }) => (
  <Button
    component={Link}
    to={{ pathname: redirect }}
    label="ra.action.cancel"
    className={className}
  >
    <IconClose />
  </Button>
);

const sanitizeRestProps = ({
  staticContext,
  ...rest
}) => rest;

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
  <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
    <SaveButton redirect={redirect || 'list'} submitOnEnter />
    <CancelButton redirect={redirect || basePath} className={classes.cancel} />
    <DeleteWithConfirmButton redirect={redirect || 'list'} undoable={null} />
  </Toolbar>
);

export default compose(
  withRouter,
  withStyles(styles),
)(CustomToolbar);
