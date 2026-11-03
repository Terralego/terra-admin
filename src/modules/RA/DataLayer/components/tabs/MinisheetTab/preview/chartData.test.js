import getChartData from './chartData';

describe('getChartData', () => {
  it('values each series by its field, named by its label or else its field', () => {
    const series = [
      { field: 'hommes', label: 'Hommes', color: '#ff0000' },
      { field: 'femmes', label: '' },
    ];

    expect(getChartData(series, { hommes: 12, femmes: '30.5' })).toEqual([
      { label: 'Hommes', value: 12, color: '#ff0000' },
      { label: 'femmes', value: 30.5 },
    ]);
  });

  it('leaves out null, missing and non numeric values', () => {
    const series = ['a', 'b', 'c', 'd', 'e'].map(field => ({ field }));

    expect(getChartData(series, { a: null, c: 'abc', d: '', e: 0 })).toEqual([{ label: 'e', value: 0 }]);
  });

  it('takes the fixed value of a series without field', () => {
    const series = [{ label: 'Objectif', value: 50 }, { label: 'Vide', value: null }];

    expect(getChartData(series, { value: 1 })).toEqual([{ label: 'Objectif', value: 50 }]);
  });
});
