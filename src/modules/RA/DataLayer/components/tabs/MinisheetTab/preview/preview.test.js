import createTemplate from '../minisheetTemplate';
import { readMinisheetConfig } from '../minisheetBlocks';
import renderTemplate from './renderTemplate';
import toPreviewParts, { wrapLegacy } from './previewParts';
import createSampleData from './sampleData';

const fields = [
  { sourceFieldId: 1, name: 'nom_site', label: 'Nom', data_type: 1 },
  { sourceFieldId: 2, name: 'altitude', label: 'Altitude', data_type: 3, round: 1 },
  { sourceFieldId: 3, name: 'ouvert', label: 'Ouvert', data_type: 4 },
];

const legacy = id => ({ id, type: 'legacy-field', template: `<p>${id}</p>` });
const withoutTitle = html => html.replace(/<h2 class="details__title">[\s\S]*?<\/h2>\n?/, '');

describe('createSampleData', () => {
  it('gives every field a value of its type', () => {
    expect(createSampleData(fields)).toEqual({ nom_site: 'Nom', altitude: 1234.5678, ouvert: true });
  });
});

describe('renderTemplate', () => {
  it('renders Nunjucks with the filters of the front, escaping values', () => {
    expect(renderTemplate('<p>{{ name | slug }} {{ html }}</p>', { name: 'Col du Lautaret', html: '<b>' }))
      .toBe('<p>col-du-lautaret &lt;b&gt;</p>');
  });

  it('turns an empty trim into an empty string', () => {
    expect(renderTemplate('<p>{{ missing | trim }}</p>', {})).toBe('<p></p>');
  });
});

describe('toPreviewParts', () => {
  it('gives consecutive Legacy blocks a single envelope', () => {
    const parts = toPreviewParts([legacy('a'), legacy('b'), { id: 'e', type: 'expert', template: 'x' }, legacy('c')]);

    expect(parts).toEqual([
      { kind: 'nunjucks', key: 'a', template: wrapLegacy(['<p>a</p>', '<p>b</p>']) },
      { kind: 'nunjucks', key: 'e', template: 'x' },
      { kind: 'nunjucks', key: 'c', template: wrapLegacy(['<p>c</p>']) },
    ]);
  });

  it('leaves other blocks to their component', () => {
    const chart = { id: 'g', type: 'chart' };

    expect(toPreviewParts([chart])).toEqual([{ kind: 'block', key: 'g', block: chart }]);
  });

  it('renders an old wizard minisheet as before, title apart', () => {
    const wizard = {
      title: { sourceFieldId: 1, default: '' },
      tree: [
        { sourceFieldId: 2, prefix: '', suffix: 'm', default: '-' },
        { group: true, name: 'Infos', children: [{ sourceFieldId: 1, prefix: '', suffix: '', default: '' }] },
      ],
    };
    const { blocks } = readMinisheetConfig({ wizard }, fields);
    const [part] = toPreviewParts(blocks);
    const oldTemplate = createTemplate({ default: '' }, wizard.tree, fields);
    const data = createSampleData(fields);

    expect(renderTemplate(part.template, data)).toBe(withoutTitle(renderTemplate(oldTemplate, data)));
  });
});
