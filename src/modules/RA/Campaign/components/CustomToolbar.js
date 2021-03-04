import React from 'react';
import { Link } from 'react-router-dom';
import { Button, SaveButton, Toolbar } from 'react-admin';
import { useField } from 'react-final-form';

/* eslint-disable import/no-extraneous-dependencies */
import { makeStyles } from '@material-ui/core/styles';

import { fade } from '@material-ui/core/styles/colorManipulator';

import IconClose from '@material-ui/icons/Close';
import IconCheck from '@material-ui/icons/Check';
import IconBlock from '@material-ui/icons/Block';
import useUserSettings from '../../../../hooks/useUserSettings';

/* eslint-enable */

const useStyles = makeStyles(theme => ({
  refuse: {
    color: theme.palette.error.main,
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: fade(theme.palette.error.main, 0.12),
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  cancel: {
    marginLeft: 'auto',
  },
  submit: {
    marginLeft: '1em',
  },
  validate: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    marginLeft: '1em',
    '&:hover': {
      backgroundColor: theme.palette.success.main,
      // Reset on mouse devices
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
}));

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

const sanitizeRestProps = ({ staticContext, ...rest }) => rest;

/**
 * A custom toolbar that action change with state and permissions
 * default redirect aware actions:
 */
const CustomToolbar = ({ basePath, redirect, ...props }) => {
  const classes = useStyles();
  const { hasPermission } = useUserSettings();

  const {
    input: { value: state },
  } = useField('state');

  if (hasPermission('can_manage_campaigns')) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        {state === 'draft' && <SaveButton redirect={redirect || 'list'} submitOnEnter />}
        {state === 'draft' && (
          <SaveButton
            redirect={redirect || 'list'}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'started' })}
            label="ra.action.start"
            icon={<IconCheck />}
            className={classes.validate}
          />
        )}

        {state === 'started' && (
          <SaveButton
            redirect={redirect || 'list'}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'closed' })}
            label="ra.action.close"
            icon={<IconBlock />}
            variant={false}
            className={`${classes.refuse}`}
          />
        )}
        <CancelButton redirect={redirect || basePath} className={classes.cancel} />
      </Toolbar>
    );
  }

  if (hasPermission('can_add_pictures')) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        <CancelButton redirect={redirect || 'list'} className={classes.cancel} />
      </Toolbar>
    );
  }

  return null;
};

export default CustomToolbar;
