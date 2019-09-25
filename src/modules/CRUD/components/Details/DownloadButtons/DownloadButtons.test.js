import React from 'react';
import renderer from 'react-test-renderer';

import DownloadButtons from './DownloadButtons';

jest.mock('@blueprintjs/core', () => ({
  ButtonGroup: ({ children }) => <ul>{children}</ul>,
  AnchorButton: ({ children }) => <li>{children}</li>,
}));


const props = {
  files: [{
    name: 'FileName',
    url: 'path/to/file/{id}',
  }, {
    name: 'FileName2',
    url: 'path/to/file2/{id}',
  }],
  id: 3,
};


it('should render correctly', () => {
  const tree = renderer.create((
    <DownloadButtons
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
