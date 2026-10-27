import createTemplate, { getFieldTemplate, getTemplateNode } from './minisheetTemplate';
import {
  getUsedFieldIds,
  isBlocksConfig,
  readMinisheetConfig,
  withLegacyTemplates,
  writeMinisheetConfig,
} from './minisheetBlocks';

const fields = [
  { sourceFieldId: 1, name: 'nom_site', label: 'Nom', data_type: 1 },
  { sourceFieldId: 2, name: 'altitude', label: 'Altitude', data_type: 3, round: 1 },
  { sourceFieldId: 3, name: 'surface', label: 'Surface', data_type: 2 },
];

const wizard = {
  title: { sourceFieldId: 1, default: 'Site sans nom' },
  tree: [
    { sourceFieldId: 2, prefix: '', suffix: 'm', default: 'inconnue' },
    {
      group: true,
      name: 'Mesures',
      children: [{ sourceFieldId: 3, prefix: '', suffix: 'ha', default: '-' }],
    },
  ],
};

const options = () => {
  let count = 0;
  return { createId: () => `b-${(count += 1)}` };
};

describe('readMinisheetConfig', () => {
  it('reads a wizard config as a title and Legacy blocks', () => {
    const config = { enable: true, advanced: false, template: 'old', wizard };
    const { title, blocks } = readMinisheetConfig(config, fields, options());

    expect(title).toEqual({ sourceFieldId: 1, field: 'nom_site', default: 'Site sans nom' });
    expect(blocks).toMatchObject([
      { id: 'b-1', type: 'legacy-field', sourceFieldId: 2, suffix: 'm', default: 'inconnue' },
      {
        id: 'b-2',
        type: 'legacy-section',
        name: 'Mesures',
        children: [{ id: 'b-3', type: 'legacy-field', sourceFieldId: 3, suffix: 'ha' }],
      },
    ]);
  });

  it('gives Legacy blocks the same Nunjucks as the old wizard template', () => {
    const { blocks } = readMinisheetConfig({ wizard }, fields, options());
    const oldTemplate = createTemplate(wizard.title, wizard.tree, fields);

    expect(oldTemplate).toContain(`</h2>\n${blocks.map(({ template }) => template).join('\n')}\n</div>`);
    expect(blocks[1].template).toContain(blocks[1].children[0].template);
  });

  it('reads an expert config as a single Expert block without title', () => {
    const config = { advanced: true, template: '<p>{{ nom_site }}</p>', wizard };

    expect(readMinisheetConfig(config, fields, options())).toMatchObject({
      title: null,
      blocks: [{ id: 'b-1', type: 'expert', template: '<p>{{ nom_site }}</p>' }],
    });
  });

  it('keeps the other keys of the config', () => {
    const config = { enable: true, highlight_color: '#ff0000', advanced: true, template: 'x' };

    expect(readMinisheetConfig(config, fields)).toMatchObject(config);
  });

  it('reads an empty config as an empty title and no block', () => {
    expect(readMinisheetConfig(undefined, fields)).toMatchObject({
      title: { sourceFieldId: undefined, field: undefined, default: '' },
      blocks: [],
    });
  });

  it('returns a block config untouched', () => {
    const config = { version: 2, title: null, blocks: [] };

    expect(readMinisheetConfig(config, fields)).toBe(config);
    expect(isBlocksConfig(config)).toBe(true);
    expect(isBlocksConfig({ wizard })).toBe(false);
  });
});

describe('writeMinisheetConfig', () => {
  it('writes an old config in the block format and keeps the old keys', () => {
    const config = { enable: true, advanced: false, template: 'old', wizard };
    const saved = writeMinisheetConfig(config, fields, options());

    expect(saved).toMatchObject({ ...config, version: 2, title: { field: 'nom_site' } });
    expect(saved.blocks).toEqual(readMinisheetConfig(config, fields, options()).blocks);
  });

  it('copies the current field name next to every sourceFieldId', () => {
    const config = {
      version: 2,
      title: { sourceFieldId: 1, field: 'ancien_nom', default: '' },
      blocks: [
        { id: 'a', type: 'field', sourceFieldId: 2 },
        {
          id: 'b',
          type: 'condition',
          when: { sourceFieldId: 3, operator: 'exists' },
          // oxlint-disable-next-line unicorn/no-thenable
          then: [{ id: 'c', type: 'chart', series: [{ sourceFieldId: 2, label: 'Alt.' }] }],
          else: [],
        },
      ],
    };
    const { title, blocks } = writeMinisheetConfig(config, fields);

    expect(title.field).toBe('nom_site');
    expect(blocks[0].field).toBe('altitude');
    expect(blocks[1].when.field).toBe('surface');
    expect(blocks[1].then[0].series[0]).toEqual({ sourceFieldId: 2, field: 'altitude', label: 'Alt.' });
  });

  it('leaves Legacy blocks with their sourceFieldId only', () => {
    const { blocks } = writeMinisheetConfig({ wizard }, fields);

    expect(blocks[0]).not.toHaveProperty('field');
    expect(blocks[1].children[0]).not.toHaveProperty('field');
  });

  it('keeps the last known name of a field that disappeared', () => {
    const config = { version: 2, title: null, blocks: [{ id: 'a', type: 'field', sourceFieldId: 9, field: 'old' }] };

    expect(writeMinisheetConfig(config, fields).blocks[0].field).toBe('old');
  });
});

describe('withLegacyTemplates', () => {
  const section = {
    id: 's',
    type: 'legacy-section',
    name: 'Mesures',
    children: [{ id: 'f', type: 'legacy-field', sourceFieldId: 3, prefix: '', suffix: 'ha', default: '-' }],
  };

  it('generates the same Nunjucks as the old wizard', () => {
    const [field, generated] = withLegacyTemplates([
      { id: 'a', type: 'legacy-field', ...wizard.tree[0] },
      section,
    ], fields);

    expect(field.template).toBe(getTemplateNode(fields, a => a)(wizard.tree[0]));
    expect(generated.template).toBe(getTemplateNode(fields, a => a)(wizard.tree[1]));
    expect(generated.children[0].template).toBe(getFieldTemplate(fields, a => a)(wizard.tree[1].children[0]));
  });

  it('follows a change of the field label', () => {
    const renamed = fields.map(field => (field.sourceFieldId === 3 ? { ...field, label: 'Superficie' } : field));
    const [generated] = withLegacyTemplates([section], renamed);

    expect(generated.template).toContain('Superficie');
    expect(generated.children[0].template).toContain('Superficie');
  });

  it('reaches Legacy blocks inside a condition', () => {
    const condition = { id: 'c', type: 'condition', when: { sourceFieldId: 1, operator: 'exists' }, else: [section] };
    const [generated] = withLegacyTemplates([condition], fields);

    expect(generated.else[0].template).toContain('details__group');
  });

  it('leaves the Nunjucks of an Expert block as written', () => {
    const expert = { id: 'e', type: 'expert', template: '<p>{{ nom_site }}</p>' };

    expect(withLegacyTemplates([expert], fields)).toEqual([expert]);
  });
});

describe('writeMinisheetConfig and the Legacy Nunjucks', () => {
  it('generates the Nunjucks of Legacy blocks again on save', () => {
    const config = {
      version: 2,
      title: null,
      blocks: [{ id: 'a', type: 'legacy-field', sourceFieldId: 2, prefix: '', suffix: 'm', default: '', template: 'stale' }],
    };

    expect(writeMinisheetConfig(config, fields).blocks[0].template).toContain('details__column-label">Altitude');
  });
});

describe('getUsedFieldIds', () => {
  it('lists the fields of the old wizard', () => {
    expect(getUsedFieldIds({ wizard })).toEqual([2, 3]);
  });

  it('lists the fields of the title and of every block', () => {
    const config = {
      title: { sourceFieldId: 1 },
      blocks: [{ id: 'a', type: 'chart', series: [{ sourceFieldId: 2 }] }, { id: 'b', type: 'expert', template: '' }],
    };

    expect(getUsedFieldIds(config)).toEqual([1, 2]);
  });
});
