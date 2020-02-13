
import React from 'react';
import renderer from 'react-test-renderer';
import ArrayOfObjects from './ArrayOfObjects';

jest.mock('../../Type', () => props => <div {...props} />);

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
};

describe('should render correctly', () => {
  it('array of objects as table', () => {
    const tree = renderer.create((
      <ArrayOfObjects {...arrayObjectsProps} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('array of objects', () => {
    const tree = renderer.create((
      <ArrayOfObjects
        {...arrayObjectsProps}
        display_value={[{
          date: '2019',
          source: 'Requalification du site',
        }, {
          date: '2018',
          source: 'Réfection toiture',
          foo: 'foo',
        }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
