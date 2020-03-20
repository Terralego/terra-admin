import React from 'react';
import renderer from 'react-test-renderer';
import FileType from './FileType';

jest.mock('../../NoValue', () => () => <div>No value</div>);

const props = {
  display_value: {
    url: 'http://file.pdf',
  },
  schema: { title: 'Name of the file' },
};

describe('should render correctly', () => {
  it('file', () => {
    const tree = renderer.create((
      <FileType {...props} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('image', () => {
    const tree = renderer.create((
      <FileType {...props} type="image" />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('nothing', () => {
    const tree = renderer.create((
      <FileType display_value={{ url: undefined }} />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
