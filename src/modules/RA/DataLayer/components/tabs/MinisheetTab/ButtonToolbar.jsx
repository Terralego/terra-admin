import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';
import { changeNodeAtPath, removeNodeAtPath } from 'react-sortable-tree';

import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import AddField from '../AddField';

const ButtonToolBar = ({ node, path, fields }) => {
  const form = useForm();

  const onAddField = useCallback(selected => {
    const {
      values: {
        minisheet_config: {
          wizard: {
            tree: treeData = [],
          } = {},
          wizard,
        } = {},
        minisheet_config: minisheetConfig,
      },
    } = form.getState();

    const { sourceFieldId } = fields.find(f => f.sourceFieldId === selected) || {};
    const tree = changeNodeAtPath({
      path,
      treeData,
      getNodeKey: ({ treeIndex: nodeKey }) => nodeKey,
      newNode: {
        ...node,
        expanded: true,
        children: [
          ...node.children,
          {
            sourceFieldId,
            prefix: '',
            suffix: '',
            default: '',
          },
        ],
      },
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, tree },
    });
  }, [fields, form, node, path]);

  const onDeleteSection = useCallback(() => {
    const {
      minisheet_config: {
        wizard: { tree: treeData = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const tree = removeNodeAtPath({
      path,
      treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, tree },
    });
  }, [form, path]);

  const onDeleteField = useCallback(() => {
    const {
      minisheet_config: {
        wizard: { tree: treeData = [] } = {},
        wizard,
      } = {},
      minisheet_config: minisheetConfig,
    } = form.getState().values;

    const tree = removeNodeAtPath({
      path,
      treeData,
      getNodeKey: ({ treeIndex }) => treeIndex,
    });

    form.change('minisheet_config', {
      ...minisheetConfig,
      wizard: { ...wizard, tree },
    });
  }, [form, path]);

  return (
    <>
      {node.group && (
      <>
        <AddField
          fields={fields}
          onAdd={onAddField}
          textContent={{
            addField: 'ra.action.add',
            selectField: 'datalayer.form.minisheet.select-field',
            add: 'ra.action.add',
            cancel: 'ra.action.cancel',
          }}
          iconOnly
        />
        <Button
          type="button"
          onClick={onDeleteSection}
          startIcon={<DeleteIcon />}
        />
      </>
      )}
      {!node.group && (
        <Button
          type="button"
          onClick={onDeleteField}
          startIcon={<DeleteIcon />}
        />
      )}
    </>
  );
};
export default ButtonToolBar;
