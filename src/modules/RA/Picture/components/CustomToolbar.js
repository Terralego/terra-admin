import React from 'react';
import { Link } from 'react-router-dom';
import { Button, SaveButton, Toolbar, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';

/* eslint-disable import/no-extraneous-dependencies */
import { makeStyles } from '@material-ui/core/styles';

import { fade } from '@material-ui/core/styles/colorManipulator';

import IconClose from '@material-ui/icons/Close';
import IconSend from '@material-ui/icons/Send';
import IconCheck from '@material-ui/icons/Check';
import IconBlock from '@material-ui/icons/Block';
import useUserSettings from '../../../../hooks/useUserSettings';
import DeleteWithConfirmButtonJS from '../../../../components/react-admin/DeleteWithConfirmButtonJS';
import SaveButtonWithConfirm from '../../../../components/react-admin/SaveButtonWithConfirm';

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
  const {
    record,
  } = props;
  const translate = useTranslate();
  const classes = useStyles();
  const { hasPermission } = useUserSettings();

  const [reason, setReason] = React.useState('');

  const {
    input: { value: state },
  } = useField('state');

  if (hasPermission('can_manage_pictures')) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        <SaveButton redirect={redirect === 'list' ? basePath : redirect} submitOnEnter />
        {state === 'submited' && (
          <SaveButtonWithConfirm
            redirect={redirect === 'list' ? basePath : redirect}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'refused', properties: { ...data.properties, refusal_message: reason } })}
            label="ra.action.refuse"
            icon={<IconBlock />}
            variant={false}
            className={`${classes.refuse}`}
            confirmTitle={translate('resources.picture.fields.refusal_message')}
            confirmContent={(
              <>
                <p>{translate('resources.picture.actions.refusal_modal_content')}</p>
                <input value={reason} onChange={e => setReason(e.target.value)} />
              </>
            )}
          />
        )}
        {state === 'submited' && (
          <SaveButtonWithConfirm
            redirect={redirect === 'list' ? basePath : redirect}
            submitOnEnter={false}
            transform={data => ({ ...data, state: 'accepted', properties: { ...data.properties, refusal_message: '' } })}
            label="ra.action.validate"
            icon={<IconCheck />}
            className={classes.validate}
            confirmTitle={translate('resources.picture.actions.accept_modal_title')}
            confirmContent={translate('resources.picture.actions.accept_modal_content')}
          />
        )}
        <CancelButton redirect={redirect === 'list' ? basePath : redirect} className={classes.cancel} />
        <DeleteWithConfirmButtonJS
          redirect={redirect || 'list'}
          mutationMode="optimistic"
          translateOptions={{
            id: record.identifier,
          }}
        />
      </Toolbar>
    );
  }

  const canModify =
    hasPermission('can_manage_pictures') ||
    (hasPermission('can_add_pictures') && ['draft', 'refused'].includes(state));

  if (!canModify) {
    return (
      <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
        <CancelButton redirect={redirect === 'list' ? basePath : redirect} className={classes.cancel} />
      </Toolbar>
    );
  }

  return (
    <Toolbar {...sanitizeRestProps(props)} className={classes.toolbar}>
      <SaveButton
        redirect={redirect === 'list' ? basePath : redirect}
        submitOnEnter
        // Reset state to draft for photographer
        transform={data =>
          (hasPermission('can_manage_pictures') ? data : { ...data, state: 'draft' })}
      />
      <SaveButton
        redirect={redirect === 'list' ? basePath : redirect}
        submitOnEnter={false}
        transform={data => ({ ...data, state: 'submited' })}
        label="ra.action.submit"
        icon={<IconSend />}
        className={classes.submit}
      />
      <CancelButton redirect={redirect === 'list' ? basePath : redirect} className={classes.cancel} />
    </Toolbar>
  );
};

export default CustomToolbar;
