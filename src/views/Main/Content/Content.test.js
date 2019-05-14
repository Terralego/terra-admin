import React from 'react';
import renderer from 'react-test-renderer';
import { Content } from './Content';


jest.mock('react-router-dom', () => ({
  Route: ({ children }) => children,
  Switch: ({ children }) => children,
}));
jest.mock('../../Summary', () => () => <div>Summary</div>);
jest.mock('../../../components/Loading', () => () => <div>Loading</div>);

function Foo () { return <p>Module Foo</p>; }
Foo.config = {
  permissions: 'admin.foo',
  path: '/foo',
};
function Bar () { return <p>Module Bar</p>; }
Bar.config = {
  permissions: 'admin.bar',
  path: '/bar',
};
it('should render correctly', () => {
  const tree = renderer.create(
    <Content modules={[Foo, Bar]} />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
