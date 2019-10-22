import React from 'react';
import renderer from 'react-test-renderer';
import { ACTION_CREATE, ACTION_UPDATE } from '../../services/CRUD';

import Details from './Details';

jest.mock('react-router-dom', () => ({
  Redirect: () => <div>Error because Redirect</div>,
}));

jest.mock('../../services/CRUD', () => ({
  ACTION_CREATE: 'create',
  ACTION_UPDATE: 'update',
}));

jest.mock('../../../../components/Loading', () => () => <div>Loading</div>);

jest.mock('../../../../utils/toast', () => ({
  toast: {
    displayError: jest.fn(),
  },
}));

jest.mock('./Metas', () => () => <div>Metas</div>);
jest.mock('./Read', () => () => <div>Read</div>);
jest.mock('./Edit', () => ({ action }) => <div>{action}</div>);

let props;
beforeEach(() => {
  props = {
    fetchFeature: jest.fn(),
    t: key => key,
    view: {
      layer: {
        id: 8,
        name: 'fooLayer',
      },
      formSchema: {
        properties: {
          city: { type: 'boolean', title: 'City' },
        },
      },
    },
    feature: {
      fooFeature: {
        identifier: 'fooFeature',
        layer: 8,
        geom: {
          type: 'Point',
          coordinates: [
            0.334734168777004,
            48.593660025881405,
          ],
        },
        properties: {
          name: 'dfdf',
        },
      },
    },
  };
});

describe('Snapshots', () => {
  it('should redirect if there is an error', () => {
    const tree = renderer.create((
      <Details
        {...props}
        hasError
        errorMessage="Not Found"
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render loading correctly', () => {
    const tree = renderer.create((
      <Details
        {...props}
        feature={{}}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render details Read correctly', () => {
    const tree = renderer.create((
      <Details
        {...props}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render details Create correctly', () => {
    const tree = renderer.create((
      <Details
        {...props}
        match={{
          params: {
            id: ACTION_CREATE,
            layer: 'fooLayer',
          },
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render details Update correctly', () => {
    const tree = renderer.create((
      <Details
        {...props}
        match={{
          params: {
            id: 'fooId',
            layer: 'fooLayer',
            action: ACTION_UPDATE,
          },
        }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('should order that details component has loaded when changing feature', () => {
  const match =  {
    params: {
      id: 'fooId',
      layer: 'fooLayer',
    },
  };
  const detailsHasLoaded =  jest.fn();
  const instance = new Details({
    ...props,
    match,
    detailsHasLoaded,
  });
  instance.componentDidUpdate({ ...props, match, feature: {} }, {});
  expect(detailsHasLoaded).toHaveBeenCalled();
});

it('should get data when changing param layer or id', () => {
  const match1 =  {
    params: {
      id: 'id1',
      layer: 'layer1',
    },
  };
  const match2 =  {
    params: {
      id: 'id2',
      layer: 'layer1',
    },
  };
  const match3 =  {
    params: {
      id: 'id2',
      layer: 'layer2',
    },
  };
  const instance = new Details({
    ...props,
    match: match1,
  });
  instance.setState = jest.fn();
  instance.getData = jest.fn();
  instance.componentDidUpdate({ ...props, match: match2 }, {});
  instance.componentDidUpdate({ ...props, match: match3 }, {});

  expect(instance.getData).toBeCalledTimes(2);
});

it('should change size', () => {
  const instance = new Details({
    ...props,
    match: {
      params: {
        id: 'fooFeature',
        layer: 'layer1',
      },
    },
    full: true,
    onSizeChange: jest.fn(),
  });
  instance.setState = jest.fn();
  instance.onSizeChange();

  expect(instance.props.onSizeChange).toHaveBeenCalledWith({
    full: false,
  });
});
