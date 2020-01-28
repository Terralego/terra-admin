import React from 'react';
import renderer from 'react-test-renderer';

import Search from './Search';

jest.mock('@blueprintjs/core', () => ({
  InputGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  Icon: {
    SIZE_STANDARD: 'standard',
  },
  Spinner: () => <div>Loading</div>,
}));

jest.mock('lodash.debounce', props => fn => () => fn(props));

let props;
beforeEach(() => {
  props = {
    loadData: () => {},
    queryString: {},
  };
});

it('should render correctly', () => {
  const tree = renderer.create((
    <Search
      {...props}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with default value', () => {
  const tree = renderer.create((
    <Search
      {...props}
      tableFilters={{ search: 'foo' }}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
