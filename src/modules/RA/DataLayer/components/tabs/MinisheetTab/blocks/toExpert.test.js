import toExpert from './toExpert';
import { withLegacyTemplates } from '../minisheetBlocks';
import renderTemplate from '../preview/renderTemplate';
import toPreviewParts from '../preview/previewParts';

const fields = [{ sourceFieldId: 2, name: 'altitude', label: 'Altitude', data_type: 3, round: 1 }];
const properties = { altitude: 1234.56 };

const render = blocks => toPreviewParts(blocks).map(({ template }) => renderTemplate(template, properties));

it.each([
  { id: 'a', type: 'legacy-field', sourceFieldId: 2, prefix: '', suffix: 'm', default: '-' },
  {
    id: 'a',
    type: 'legacy-section',
    name: 'Relief',
    children: [{ id: 'b', type: 'legacy-field', sourceFieldId: 2, prefix: '', suffix: 'm', default: '-' }],
  },
])('turns a $type into an Expert block that renders the same', legacy => {
  const expert = toExpert.run(legacy, { fields, translate: a => a });

  expect(expert).toMatchObject({ id: 'a', type: 'expert' });
  expect(render([expert])).toEqual(render(withLegacyTemplates([legacy], fields)));
});
