import React from 'react';
import renderer from 'react-test-renderer';

import DownloadButtons from './DownloadButtons';

jest.mock('@blueprintjs/core', () => ({
  ButtonGroup: ({ children }) => <ul>{children}</ul>,
  AnchorButton: ({ children }) => <li>{children}</li>,
}));


const props = {
  documents: [{
    template_name: 'FileName',
    download_url: 'path/to/file/',
    template_file: 'file1.pdf',
  }, {
    template_name: 'FileName2',
    download_url: 'path/to/file2/',
    template_file: 'file2.pdf',
  }],
};


it('should render correctly', () => {
  const tree = renderer.create((
    <DownloadButtons
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
