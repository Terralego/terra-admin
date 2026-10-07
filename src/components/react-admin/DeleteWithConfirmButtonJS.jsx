import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';

import {
  Button,
  Confirm,
  useDeleteWithConfirmController,
  useResourceContext,
  useTranslate,
} from 'react-admin';

import classnames from 'classnames';
import inflection from 'inflection';

const defaultIcon = <ActionDelete />;

const useStyles = makeStyles(
  theme => ({
    deleteButton: {
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: fade(theme.palette.error.main, 0.12),
        // Reset on mouse devices
        '@media (hover: none)': {
          backgroundColor: 'transparent',
        },
      },
    },
  }),
  { name: 'RaDeleteWithConfirmButtonJS' },
);

const DeleteWithConfirmButtonJS = props => {
  const {
    basePath,
    classes: classesOverride,
    className,
    confirmTitle = 'ra.message.delete_title',
    confirmContent = 'ra.message.delete_content',
    icon = defaultIcon,
    label = 'ra.action.delete',
    mutationMode,
    onClick,
    record,
    redirect = 'list',
    onSuccess,
    onFailure,
    translateOptions = {},
    ...rest
  } = props;

  const translate = useTranslate();
  const classes = useStyles(props);
  const resource = useResourceContext(props);
  const {
    open,
    loading,
    handleDialogOpen,
    handleDialogClose,
    handleDelete,
  } = useDeleteWithConfirmController({
    record,
    redirect,
    basePath,
    mutationMode,
    onClick,
    onSuccess,
    onFailure,
    resource,
  });

  return (
    <>
      <Button
        onClick={handleDialogOpen}
        label={label}
        className={classnames(
          'ra-delete-button',
          classes.deleteButton,
          className,
        )}
        key="button"
        {...rest}
      >
        {icon}
      </Button>
      <Confirm
        isOpen={open}
        loading={loading}
        title={confirmTitle}
        content={confirmContent}
        translateOptions={{
          name: translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 1,
            _: inflection.humanize(
              translate(`resources.${resource}.name`, {
                smart_count: 1,
                _: inflection.singularize(resource),
              }),
              true,
            ),
          }),
          id: record.id,
          ...translateOptions,
        }}
        onConfirm={handleDelete}
        onClose={handleDialogClose}
      />
    </>
  );
};

export default DeleteWithConfirmButtonJS;
