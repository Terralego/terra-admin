import React from 'react';
import renderer from 'react-test-renderer';
import StringType from './StringType';

jest.mock('../../NoValue', () => () => <div>No value</div>);

describe('should render correctly', () => {
  it('number', () => {
    const tree = renderer.create((
      <StringType display_value={42} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('text', () => {
    const tree = renderer.create((
      <StringType display_value="Foo" />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('HTML', () => {
    const tree = renderer.create((
      <StringType display_value="<p>Bar</p>" />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('nothing', () => {
    const tree = renderer.create((
      <StringType display_value={null} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
