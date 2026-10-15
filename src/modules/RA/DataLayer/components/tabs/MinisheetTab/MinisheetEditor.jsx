import React from 'react';
import { useTranslate } from 'react-admin';
import { useField, useForm } from 'react-final-form';
import Stack from '@mui/material/Stack';
import { v4 as uuid } from 'uuid';

import BlockEditor from '../../../../../../components/BlockEditor/BlockEditor';
import { CATEGORIES, MAX_DEPTH, minisheetRegistry, rootAccepts } from './blocks';
import TitleBlock from './blocks/TitleBlock';
import { isBlocksConfig, readMinisheetConfig } from './minisheetBlocks';

const createId = () => `b-${uuid()}`;

/**
 * Editor of the minisheet blocks. An old config is shown as blocks without
 * being changed in the form; the first edit writes the title and the blocks.
 */
export const MinisheetEditor = () => {
  const translate = useTranslate();
  const form = useForm();
  const { input: { value: config } } = useField('minisheet_config', { subscription: { value: true } });
  const { input: { value: fields } } = useField('fields', { subscription: { value: true } });

  const { blocks: storedBlocks, title: storedTitle, wizard, advanced, template } = config || {};
  const view = React.useMemo(
    () => readMinisheetConfig(
      isBlocksConfig({ blocks: storedBlocks })
        ? { blocks: storedBlocks, title: storedTitle }
        : { wizard, advanced, template },
      fields || [],
      { translate, createId },
    ),
    [storedBlocks, storedTitle, wizard, advanced, template, fields, translate],
  );

  const write = React.useCallback(({ title, blocks }) => form.batch(() => {
    form.change('minisheet_config.title', title);
    form.change('minisheet_config.blocks', blocks);
  }), [form]);

  const context = React.useMemo(() => ({ fields: fields || [], translate }), [fields, translate]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <TitleBlock
        title={view.title}
        fields={context.fields}
        onChange={title => write({ title, blocks: view.blocks })}
      />
      <BlockEditor
        blocks={view.blocks}
        onChange={blocks => write({ title: view.title, blocks })}
        registry={minisheetRegistry}
        categories={CATEGORIES}
        rootAccepts={rootAccepts}
        maxDepth={MAX_DEPTH}
        context={context}
        createId={createId}
      />
    </Stack>
  );
};

export default MinisheetEditor;
