import React from 'react';
import renderer from 'react-test-renderer';

import Read from './Read';

jest.mock('react-router-dom', () => ({
  Redirect: () => <div>Error because Redirect</div>,
}));

jest.mock('../../../../../utils/toast', () => ({
  toast: {
    displayError: children => <div>{children}</div>,
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

jest.mock('../DownloadButtons', () => () => <div>DownloadButtons</div>);

jest.mock('../Header', () => props => <div {...props}>Header</div>);
jest.mock('../Menu', () => props => <div {...props}>Menu</div>);
jest.mock('./DefaultView', () => props => <div {...props}>Default view</div>);
jest.mock('./AttachmentView', () => props => <div {...props}>Attachmentu view</div>);

const props = {
  t: text => text,
  match: { params: { layer: 'layerFoo' } },
  displayViewFeature: true,
  feature: {
    title: 'Title of the feature',
    display_properties: {
      foo: 'foo',
    },
    new_display_properties: {
      foo: 'foo',
    },
    documents: [{
      file1: 'file1',
      file2: 'file2',
    }],
  },
};

it('should redirect', () => {
  const tree = renderer.create((
    <Read
      {...props}
      displayViewFeature={false}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});


it('should render defaultView correctly', () => {
  const tree = renderer.create((
    <Read
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render AttachmentView correctly', () => {
  const tree = renderer.create((
    <Read
      {...props}
      match={{ params: { layer: 'layerFoo', section: 'attachmentFiles' } }}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
