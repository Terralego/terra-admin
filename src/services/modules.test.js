import React from 'react';
import { getModulesComponentsByPermissions } from './modules';

jest.mock('../modules', () => {
  function Foo () { return <p>Foo</p>; }
  Foo.config = {
    permission: 'admin.foo',
  };
  function Bar () { return <p>Bar</p>; }
  Bar.config = {
    permission: 'admin.bar',
  };
  return {
    Foo: {
      default: Foo,
    },
    Bar: {
      default: Bar,
    },
  };
});

it('should not get any module', () => {
  expect(getModulesComponentsByPermissions()).toEqual([]);
});

it('should get Foo module', () => {
  const getFooModule = getModulesComponentsByPermissions(['admin.foo']);
  expect(getFooModule[0]()).toEqual(<p>Foo</p>);
  expect(getFooModule.length).toEqual(1);
});

it('should get Foo and Bar module', () => {
  const getFooBarModules = getModulesComponentsByPermissions(['admin.foo', 'admin.bar']);
  expect(getFooBarModules[0]()).toEqual(<p>Foo</p>);
  expect(getFooBarModules[1]()).toEqual(<p>Bar</p>);
  expect(getFooBarModules.length).toEqual(2);
});
