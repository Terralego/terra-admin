import React from 'react';
import renderer from 'react-test-renderer';

import Actions from './Actions';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div>{children}</div>,
}));

jest.mock('@blueprintjs/core', () => ({
  Icon: ({ icon }) => <li>{icon}</li>,
  Button: ({ children }) => <div>{children}</div>,
  Popover: ({ children }) => <div>{children}</div>,
  H5: ({ children }) => <h5>{children}</h5>,
  PopoverInteractionKind: {
    CLICK: 'click',
  },
  Classes: {
    POPOVER_CONTENT_SIZING: 'POPOVER_CONTENT_SIZING',
  },
}));

jest.mock('../../../config', () => ({
  generateURI: jest.fn(),
}));

jest.mock('../../../../../utils/toast', () => ({
  toast: {
    displayToaster: bool => <div>{bool ? 'Success' : 'Fail'}</div>,
  },
}));

let props;
beforeEach(() => {
  props = {
    paramLayer: 'LayerFoo',
    paramId: 'featureFoo',
    displayUpdate: true,
    displayDelete: true,
    displayCancel: true,
    children: <div>Children component</div>,
    t: key => key,
    layer: {
      id: 10,
    },
    history: {
      push: jest.fn(),
    },
    deleteFeature: () => 'foo',
    getSettings: jest.fn(),
  };
});


it('should render correctly', () => {
  const tree = renderer.create((
    <Actions
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should delete feature', async () => {
  const instance = new Actions({ ...props });
  instance.deleteFeature();
  await true;
  expect(instance.props.getSettings).toHaveBeenCalled();
});

it('should not crash when no deleting feature', async () => {
  const instance = new Actions({ ...props, deleteFeature: () => undefined });
  instance.deleteFeature();
  await true;
  expect(instance.props.getSettings).not.toHaveBeenCalled();
});
