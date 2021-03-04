import React from 'react';
import { Link } from 'react-router-dom';
import { Button, DeleteWithConfirmButton, SaveButton, Toolbar } from 'react-admin';
import { useField } from 'react-final-form';

/* eslint-disable import/no-extraneous-dependencies */
import { makeStyles } from '@material-ui/core/styles';

import { fade } from '@material-ui/core/styles/colorManipulator';

import IconClose from '@material-ui/icons/Close';
import IconSend from '@material-ui/icons/Send';
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
    // color: 'green',
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
 * A custom toolbar that can be used in various form footer with
 * default redirect aware actions:
 * - A save button
 * - A cancel button
 * - A delete button
 */
const CustomToolbar = ({ basePath, redirect, ...props }) => {
  const classes = useStyles();
  const { hasPermission } = useUserSettings();

  const {
    input: { value: state },
  } = useField('state');

  if (hasPermission('can_manage_pictures')) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        <SaveButton redirect={redirect || 'list'} submitOnEnter />
        {state === 'submited' && (
          <SaveButton
            redirect={redirect || 'list'}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'accepted' })}
            label="ra.action.validate"
            icon={<IconCheck />}
            className={classes.validate}
          />
        )}
        {state === 'submited' && (
          <SaveButton
            redirect={redirect || 'list'}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'refused' })}
            label="ra.action.refuse"
            icon={<IconBlock />}
            variant={false}
            className={`${classes.refuse}`}
          />
        )}
        <CancelButton redirect={redirect || basePath} className={classes.cancel} />
      </Toolbar>
    );
  }

  const canModify =
    hasPermission('can_manage_pictures') ||
    (hasPermission('can_add_pictures') && ['draft', 'refused'].includes(state));

  if (!canModify) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        <CancelButton redirect={redirect || 'list'} className={classes.cancel} />
      </Toolbar>
    );
  }

  return (
    <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
      <SaveButton
        redirect={redirect || 'list'}
        submitOnEnter
        // Reset state to draft for photographer
        transform={data =>
          (hasPermission('can_manage_pictures') ? data : { ...data, state: 'draft' })}
      />
      <SaveButton
        redirect={redirect || 'list'}
        submitOnEnter={false}
        transform={data => ({ ...data, state: 'submited' })}
        label="ra.action.submit"
        icon={<IconSend />}
        className={classes.submit}
      />
      <CancelButton redirect={redirect || basePath} className={classes.cancel} />
      <DeleteWithConfirmButton redirect={redirect || 'list'} undoable={null} />
    </Toolbar>
  );
};

export default CustomToolbar;
