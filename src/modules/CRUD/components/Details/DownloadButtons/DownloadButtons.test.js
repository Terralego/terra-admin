import React from 'react';
import renderer from 'react-test-renderer';

import DownloadButtons from './DownloadButtons';

jest.mock('@blueprintjs/core', () => ({
  Popover: ({ children, ...props }) => <div {...props}>{children}</div>,
  Menu: ({ children }) => <ul>{children}</ul>,
  MenuItem: ({ children }) => <li>{children}</li>,
  Button: ({ text }) => <div>{text}</div>,
  Position: {
    BOTTOM_RIGHT: 'bottom-right',
  },
  Classes: {
    MINIMAL: 'MINIMAL',
  },
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
