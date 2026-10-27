import { v4 as uuid } from 'uuid';

import { getFieldTemplate, getTemplateNode } from './minisheetTemplate';

export const MINISHEET_VERSION = 2;

const LEGACY_TYPES = new Set(['legacy-section', 'legacy-field']);

const defaultCreateId = () => `b-${uuid()}`;

export const isBlocksConfig = ({ blocks } = {}) => Array.isArray(blocks);

const findField = (fields, sourceFieldId) =>
  fields.find(field => field.sourceFieldId === sourceFieldId);

const pickLegacyField = ({ sourceFieldId, prefix, suffix, default: defaultText }) =>
  ({ sourceFieldId, prefix, suffix, default: defaultText });

const readWizardNode = createId => node => {
  if (!node.group) {
    return { id: createId(), type: 'legacy-field', ...pickLegacyField(node) };
  }

  const { name, children = [] } = node;
  return {
    id: createId(),
    type: 'legacy-section',
    name,
    children: children.map(child => ({ id: createId(), type: 'legacy-field', ...pickLegacyField(child) })),
  };
};

const BRANCHES = ['children', 'then', 'else'];

/**
 * Generates the Nunjucks of every Legacy block with the code of the old
 * wizard, so that it renders exactly as before. The front only renders it.
 * A Legacy field inside a section gets the list item its section includes.
 */
export const withLegacyTemplates = (blocks = [], fields = [], translate = a => a) => {
  const nodeTemplate = getTemplateNode(fields, translate);
  const sectionFieldTemplate = getFieldTemplate(fields, translate);

  const generate = block => {
    if (block.type === 'legacy-field') {
      return { ...block, template: nodeTemplate(block) };
    }
    if (block.type === 'legacy-section') {
      const children = (block.children ?? [])
        .map(child => ({ ...child, template: sectionFieldTemplate(child) }));
      return { ...block, template: nodeTemplate({ group: true, name: block.name, children }), children };
    }
    const branches = BRANCHES
      .filter(key => Array.isArray(block[key]))
      .map(key => [key, block[key].map(generate)]);
    return { ...block, ...Object.fromEntries(branches) };
  };

  return blocks.map(generate);
};

const readWizardTitle = ({ sourceFieldId, default: defaultTitle = '' } = {}, fields) => ({
  sourceFieldId,
  field: findField(fields, sourceFieldId)?.name,
  default: defaultTitle,
});

/**
 * Gives the block view of a minisheet config. An old config (wizard or
 * expert mode) is read as is, without touching what is stored: the wizard
 * becomes Legacy blocks, the expert template a single Expert block.
 */
export const readMinisheetConfig = (
  config = {},
  fields = [],
  { translate = a => a, createId = defaultCreateId } = {},
) => {
  if (isBlocksConfig(config)) {
    return config;
  }

  const { advanced, template = '', wizard: { title, tree = [] } = {} } = config;

  if (advanced) {
    return {
      ...config,
      title: null,
      blocks: [{ id: createId(), type: 'expert', template }],
    };
  }

  return {
    ...config,
    title: readWizardTitle(title, fields),
    blocks: withLegacyTemplates(tree.map(readWizardNode(createId)), fields, translate),
  };
};

const withFieldNames = fields => {
  const walk = value => {
    if (Array.isArray(value)) {
      return value.map(walk);
    }
    if (!value || typeof value !== 'object') {
      return value;
    }

    const walked = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, walk(child)]));
    if (!('sourceFieldId' in value) || LEGACY_TYPES.has(value.type)) {
      return walked;
    }

    const field = findField(fields, value.sourceFieldId);
    return field ? { ...walked, field: field.name } : walked;
  };
  return walk;
};

/**
 * Gives the minisheet config to save, always in the block format. The
 * Nunjucks of the Legacy blocks is generated again, as the fields may have
 * changed (label, type, rounding). There is no global template: the old keys
 * (wizard, advanced, template) are kept untouched until the end of the migration.
 */
export const writeMinisheetConfig = (config = {}, fields = [], options = {}) => {
  const { title, blocks, ...rest } = readMinisheetConfig(config, fields, options);
  const walk = withFieldNames(fields);

  return {
    ...rest,
    version: MINISHEET_VERSION,
    title: title && walk(title),
    blocks: walk(withLegacyTemplates(blocks, fields, options.translate)),
  };
};

const collectFieldIds = value => {
  if (Array.isArray(value)) {
    return value.flatMap(collectFieldIds);
  }
  if (!value || typeof value !== 'object') {
    return [];
  }
  const own = value.sourceFieldId === undefined ? [] : [value.sourceFieldId];
  return [...own, ...Object.values(value).flatMap(collectFieldIds)];
};

/** sourceFieldId of every field the minisheet uses, in the old or the new format. */
export const getUsedFieldIds = (config = {}) => (isBlocksConfig(config)
  ? collectFieldIds([config.title, config.blocks])
  : collectFieldIds(config.wizard?.tree ?? []));
