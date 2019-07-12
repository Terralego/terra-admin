import React from 'react';
import { getComponentsByEnabledModules } from './modules';

jest.mock('../modules', () => {
  function Foo () { return <p>Foo</p>; }
  function Bar () { return <p>Bar</p>; }
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
  expect(getComponentsByEnabledModules()).toEqual([]);
});

it('should get Foo module', () => {
  const getFooModule = getComponentsByEnabledModules(['Foo']);
  expect(getFooModule[0]()).toEqual(<p>Foo</p>);
  expect(getFooModule.length).toEqual(1);
});

it('should get Foo and Bar module', () => {
  const getFooBarModules = getComponentsByEnabledModules(['Foo', 'Bar']);
  expect(getFooBarModules[0]()).toEqual(<p>Foo</p>);
  expect(getFooBarModules[1]()).toEqual(<p>Bar</p>);
  expect(getFooBarModules.length).toEqual(2);
});
