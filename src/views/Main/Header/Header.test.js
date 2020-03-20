import React from 'react';
import renderer from 'react-test-renderer';

import Header from  './Header';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children }) => <div>{children}</div>,
}));
jest.mock('@blueprintjs/core', () => ({
  Navbar: props => <div {...props} />,
  NavbarGroup: props => <div {...props} />,
  NavbarHeading: props => <div {...props} />,
  Classes: {
    DARK: 'DARK',
  },
}));
jest.mock('../UserDropdown', () => props => <div {...props} />);
jest.mock('../MenuDropdown', () => props => <div {...props} />);


describe('should display text or logo', () => {
  it('should display default title', () => {
    const tree = renderer.create((
      <Header
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should display title', () => {
    const tree = renderer.create((
      <Header
        title="Foo Title"
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display alt', () => {
    const tree = renderer.create((
      <Header
        title="Foo Title"
        logo={{
          src: undefined,
          alt: 'Company name',
        }}
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display logo', () => {
    const tree = renderer.create((
      <Header
        title="Foo Title"
        logo={{
          src: 'path/to/logo.png',
          alt: 'Company name',
        }}
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('should display text or logo', () => {
  it('should display default title', () => {
    const tree = renderer.create((
      <Header
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('should display title', () => {
    const tree = renderer.create((
      <Header
        title="Foo Title"
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should display alt', () => {
    const tree = renderer.create((
      <Header
        title="Foo Title"
        logo={{
          src: undefined,
          alt: 'Company name',
        }}
        t={text => text}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

it('should display menu when user is authenticated', () => {
  const tree = renderer.create((
    <Header
      t={text => text}
      authenticated
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
