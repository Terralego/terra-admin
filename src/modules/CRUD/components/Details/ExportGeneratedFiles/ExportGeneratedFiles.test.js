import React from 'react';
import renderer from 'react-test-renderer';

import ExportGeneratedFiles from './ExportGeneratedFiles';

jest.mock('@blueprintjs/core', () => ({
  MenuDivider: props => <li {...props} />,
  MenuItem: props => <li {...props} />,
  Classes: {
    MINIMAL: 'MINIMAL',
  },
}));


const props = {
  files: [{
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
    <ExportGeneratedFiles
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
