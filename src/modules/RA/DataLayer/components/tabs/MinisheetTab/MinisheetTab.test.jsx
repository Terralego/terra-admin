import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import MinisheetTab from '.';
import { writeMinisheetConfig } from './minisheetBlocks';
import MinisheetPreview from './preview/MinisheetPreview';

const dataProvider = { getOne: () => Promise.resolve({ data: { id: 7, geom_type: 0 } }) };

vi.mock('react-admin', async importOriginal => ({
  ...(await importOriginal()),
  useTranslate: () => key => key,
  useLocale: () => 'fr',
  useDataProvider: () => dataProvider,
  required: () => () => undefined,
}));

const FIELDS = [
  { sourceFieldId: 1, name: 'nom_site', label: 'Nom', data_type: 1 },
  { sourceFieldId: 2, name: 'altitude', label: 'Altitude', data_type: 3, round: 1 },
  { sourceFieldId: 3, name: 'ouvert', label: 'Ouvert', data_type: 4 },
];

const PROPERTIES = { nom_site: 'Col du Lautaret', altitude: 2057.62, ouvert: true };

const EXPERT = {
  enable: true,
  highlight_color: '#ff0000',
  advanced: true,
  template: '<h2>{{ nom_site }}</h2>\n{% if ouvert %}<p>Ouvert</p>{% endif %}\n<p>{{ altitude | round(1) }} m</p>',
  wizard: { title: { sourceFieldId: 1, default: '' }, tree: [] },
  settings: { compare: { url: 'https://example.com/{{ nom_site }}' } },
};

const WIZARD = {
  enable: true,
  advanced: false,
  template: '<p>template global généré par l\'assistant</p>',
  wizard: {
    title: { sourceFieldId: 1, default: 'Sans nom' },
    tree: [
      { sourceFieldId: 2, prefix: '', suffix: ' m', default: '-' },
      {
        group: true,
        name: 'Infos',
        children: [
          { sourceFieldId: 1, prefix: 'Site : ', suffix: '', default: '' },
        ],
      },
      { sourceFieldId: 99, prefix: '', suffix: '', default: 'disparu' },
    ],
  },
};

const renderTab = config => {
  const initialValues = { source: 7, fields: FIELDS, minisheet_config: config };
  let form;
  const view = render(
    <MemoryRouter initialEntries={['/layer/1/minisheet']}>
      <Form
        onSubmit={() => {}}
        initialValues={initialValues}
        render={({ form: current }) => {
          form = current;
          return <MinisheetTab />;
        }}
      />
    </MemoryRouter>,
  );
  return { ...view, form, initialValues };
};

const openEveryBlock = async label => {
  const headers = await screen.findAllByText(label);
  headers.forEach(header => fireEvent.click(header));
  return headers;
};

const textOf = container => container.textContent.replace(/\s+/g, ' ');

const expectSameConfig = (form, config) => {
  expect(form.getState().values.minisheet_config).toEqual({ highlight_color: '#cccccc', ...config });
};

describe('MinisheetTab with an old expert minisheet', () => {
  it('opens as a single Expert block, without changing the config', async () => {
    const { form } = renderTab(EXPERT);

    const [header] = await openEveryBlock('datalayer.form.minisheet.blocks.expert');
    expect(screen.getAllByText('datalayer.form.minisheet.blocks.expert')).toHaveLength(1);
    expect(screen.queryByText(/legacy-/)).toBeNull();
    expect(header.closest('.MuiPaper-root').querySelector('.CodeMirror').CodeMirror.getValue()).toBe(EXPERT.template);
    expectSameConfig(form, EXPERT);
  });

  it('saves and previews as before', () => {
    const saved = writeMinisheetConfig(EXPERT, FIELDS);

    expect(saved.blocks).toEqual([expect.objectContaining({ type: 'expert', template: EXPERT.template })]);
    expect(saved).toMatchObject({ advanced: true, template: EXPERT.template, settings: EXPERT.settings });

    const { container } = render(<MinisheetPreview config={saved} properties={PROPERTIES} />);
    expect(textOf(container)).toContain('Col du Lautaret');
    expect(textOf(container)).toContain('Ouvert');
    expect(textOf(container)).toContain('2057.6 m');
  });
});

describe('MinisheetTab with an old wizard minisheet', () => {
  it('opens as a title and Legacy blocks, without changing the config', async () => {
    const { form } = renderTab(WIZARD);

    await openEveryBlock('datalayer.form.minisheet.blocks.legacy-field');
    await openEveryBlock('datalayer.form.minisheet.blocks.legacy-section');
    expect(screen.getAllByText('datalayer.form.minisheet.blocks.legacy-field')).toHaveLength(3);
    expect(screen.getAllByText('datalayer.form.minisheet.blocks.legacy-section')).toHaveLength(1);
    expect(screen.getByDisplayValue('Infos')).toBeTruthy();
    expect(screen.getByDisplayValue('Site : ', { normalizer: value => value })).toBeTruthy();
    expectSameConfig(form, WIZARD);
  });

  it('writes the blocks on the first edit, the old keys kept', async () => {
    const { form } = renderTab(WIZARD);

    await openEveryBlock('datalayer.form.minisheet.blocks.legacy-section');
    fireEvent.change(screen.getByDisplayValue('Infos'), { target: { value: 'Informations' } });

    const { minisheet_config: config } = form.getState().values;
    expect(config.blocks.map(({ type }) => type)).toEqual(['legacy-field', 'legacy-section', 'legacy-field']);
    expect(config.blocks[1].name).toBe('Informations');
    expect(config.wizard).toEqual(WIZARD.wizard);
    expect(config.template).toBe(WIZARD.template);
  });

  it('saves and previews as before', () => {
    const saved = writeMinisheetConfig(WIZARD, FIELDS);

    expect(saved.title).toMatchObject({ sourceFieldId: 1, field: 'nom_site', default: 'Sans nom' });
    expect(saved).toMatchObject({ wizard: WIZARD.wizard, template: WIZARD.template });

    const { container } = render(<MinisheetPreview config={saved} properties={PROPERTIES} />);
    expect(textOf(container)).toContain('Col du Lautaret');
    expect(textOf(container)).toContain('Infos');
    expect(textOf(container)).toContain('Site : Col du Lautaret');
    expect(textOf(container)).toContain('disparu');
  });
});

describe('MinisheetTab with an incomplete old minisheet', () => {
  it.each([
    ['expert without template', { enable: true, advanced: true }],
    ['wizard without tree', { enable: true, wizard: {} }],
    ['nothing but enable', { enable: true }],
  ])('opens a %s', async (name, config) => {
    const { form } = renderTab(config);

    expect(await screen.findByText('datalayer.form.minisheet.enabled')).toBeTruthy();
    expectSameConfig(form, config);
    render(<MinisheetPreview config={writeMinisheetConfig(config, FIELDS)} properties={PROPERTIES} />);
  });

  it('shows the button to enable a disabled minisheet', async () => {
    renderTab({ ...WIZARD, enable: false });

    expect(await screen.findByText('datalayer.form.minisheet.enable')).toBeTruthy();
    expect(screen.queryByText('datalayer.form.minisheet.blocks.legacy-field')).toBeNull();
  });
});
