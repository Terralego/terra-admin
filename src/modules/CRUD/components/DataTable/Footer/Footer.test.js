import React from 'react';
import renderer from 'react-test-renderer';

import Footer from './Footer';

jest.mock('react-paginate', () => ({ ...props }) => <div {...props}>Pagination</div>);

jest.mock('query-string', () => ({
  parseUrl: str => ({
    query: {
      page: {
        str,
      },
    },
  }),
}));

jest.mock('@blueprintjs/core', () => ({
  Alignment: {
    CENTER: 'center',
  },
  Classes: {
    INLINE: 'inline',
  },
  Label: ({ children, ...props }) => <span {...props}>{children}</span>,
  Navbar: ({ children, ...props }) => <nav {...props}>{children}</nav>,
  NavbarGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
  HTMLSelect: ({ options, ...props }) => (
    <select {...props}>
      {options.map(item => <option key={item} value={item}>{item}</option>)}
    </select>
  ),
}));

let props;
beforeEach(() => {
  props = {
    t: text => text,
    featuresList: { count: 10, previous: '1', next: '3' },
    onPageChange: () => {},
    pageSize: 10,
    querystring: {},
    setPageSize: () => {},
  };
});

describe('Snapshots', () => {
  it('should render correctly', () => {
    const tree = renderer.create((
      <Footer
        {...props}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should not render anything', () => {
    const tree = renderer.create((
      <Footer
        {...props}
        featuresList={{ count: 10, previous: null, next: null }}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
