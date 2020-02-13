
import React from 'react';
import renderer from 'react-test-renderer';
import ObjectType from './ObjectType';

jest.mock('..', () => props => <div {...props} />);
jest.mock('../../NoValue', () => () => <div>No value</div>);

const props = {
  display_value: {
    date: '2019',
    source: 'Requalification du site',
  },
  schema: {
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
};

describe('should render correctly', () => {
  it('object', () => {
    const tree = renderer.create((
      <ObjectType {...props} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('nothing', () => {
    const tree = renderer.create((
      <ObjectType {...props} display_value={null} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
