
import React from 'react';
import renderer from 'react-test-renderer';
import ArrayType from './ArrayType';

jest.mock('..', () => props => <div {...props} />);
jest.mock('../../NoValue', () => () => <div>No value</div>);
jest.mock('./ArrayOfObjects', () => props => <div {...props} />);

const arrayStringsProps = {
  display_value: ['Chemin du Puy-en-Velay', 'Chemin des Piémonts '],
  schema: {
    items: {
      enum: [
        'Chemin du Puy-en-Velay',
        "Chemin d'Arles",
        'Chemin de Tours',
        'Chemin des Piémonts ',
        'Chemin de Vézelay',
        'Autre itinéraire',
      ],
      type: 'string',
    },
  },
};

const arrayObjectsProps = {
  display_value: [{
    date: '2019',
    source: 'Requalification du site',
  }, {
    date: '2018',
    source: 'Réfection toiture',
  }],
  schema: {
    items: {
      properties: {
        date: {
          type: 'string',
          title: 'Date',
          format: 'date',
        },
        source: {
          type: 'string',
          title: 'Source',
        },
      },
      type: 'object',
    },
  },
  ui_schema: {
    items: {
      date: {
        'ui:help': 'YYYY/MM/DD format',
      },
    },
  },
};

describe('should render correctly', () => {
  it('array of strings', () => {
    const tree = renderer.create((
      <ArrayType {...arrayStringsProps} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('array of objects', () => {
    const tree = renderer.create((
      <ArrayType
        {...arrayObjectsProps}

      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('nothing', () => {
    const tree = renderer.create((
      <ArrayType {...arrayStringsProps} display_value={[]} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
