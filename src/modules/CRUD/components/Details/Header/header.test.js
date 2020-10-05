import React from 'react';
import renderer from 'react-test-renderer';

import Header from './Header';

jest.mock('../FitBoundButton', () => props => <div {...props}>FitBoundButton</div>);
jest.mock('../ExportGeneratedFiles', () => props => <div {...props}>ExportGeneratedFiles</div>);


const props = {
  title: 'Title',
};

it('should render correctly', () => {
  const tree = renderer.create((
    <Header {...props} />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with documents', () => {
  const tree = renderer.create((
    <Header
      {...props}
      documents={[
        { template_name: 'foo', download_url: 'path/to/file', template_file: 'foo.pdf' },
      ]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
