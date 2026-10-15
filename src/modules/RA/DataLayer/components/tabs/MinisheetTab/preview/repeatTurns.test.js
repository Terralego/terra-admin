import repeatTurns from './repeatTurns';

describe('repeatTurns', () => {
  const properties = { nom_site: 'Lautaret', altitude: 2058, ouvert: false, vide: '' };
  const block = {
    fields: [
      { sourceFieldId: 2, field: 'altitude', label: 'Altitude', format: { decimals: 0 } },
      { sourceFieldId: 3, field: 'ouvert', label: 'Ouvert' },
      { sourceFieldId: 4, field: 'vide', label: 'Vide' },
      { sourceFieldId: 5, field: 'absent', label: 'Absent' },
      { label: 'Sans champ' },
    ],
  };

  it('gives one turn for each field with a value, false and 0 included', () => {
    expect(repeatTurns(block, properties).map(({ item }) => item.field)).toEqual(['altitude', 'ouvert']);
  });

  it('adds the value, label and name of the field of the turn to the properties', () => {
    expect(repeatTurns(block, properties, 'en')[0].properties).toEqual({
      ...properties, $value: 2058, $formatted_value: '2,058', $icon: '', $label: 'Altitude', $field: 'altitude',
    });
  });

  it('formats the value as the field of the list says, the icon of a boolean apart', () => {
    const turns = repeatTurns({
      fields: [
        { field: 'altitude', format: { decimals: 1 } },
        { field: 'ouvert', format: { true: { text: 'Oui', icon: '✅' }, false: { text: 'Non', icon: '❌' } } },
      ],
    }, properties, 'fr');
    expect(turns.map(({ properties: { $formatted_value: text, $icon: icon } }) => [text, icon]))
      .toEqual([['2\u202f058,0', ''], ['Non', '❌']]);
  });

  it('gives no turn without fields', () => {
    expect(repeatTurns({}, properties)).toEqual([]);
  });
});
