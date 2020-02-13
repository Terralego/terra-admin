import React from 'react';
import renderer from 'react-test-renderer';
import BooleanType from './BooleanType';


describe('should render correctly', () => {
  it('true', () => {
    const tree = renderer.create((
      <BooleanType display_value />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('false', () => {
    const tree = renderer.create((
      <BooleanType display_value={false} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('nothing', () => {
    const tree = renderer.create((
      <BooleanType display_value={null} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
