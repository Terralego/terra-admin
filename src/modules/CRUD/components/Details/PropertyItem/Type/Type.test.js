/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';

import Type, { getComponent, getRightType } from './Type';

import ArrayType from './ArrayType';
import BooleanType from './BooleanType';
import FileType from './FileType';
import ObjectType from './ObjectType';
import NumberType from './NumberType';
import StringType from './StringType';

jest.mock('./ArrayType', () => jest.fn().mockName('ArrayType'));
jest.mock('./BooleanType', () => jest.fn().mockName('BooleanType'));
jest.mock('./FileType', () => jest.fn().mockName('FileType'));
jest.mock('./ObjectType', () => jest.fn().mockName('ObjectType'));
jest.mock('./NumberType', () => jest.fn().mockName('NumberType'));
jest.mock('./StringType', () => jest.fn().mockName('StringType'));

jest.spyOn(global.console, 'warn');

beforeEach(() => {
  console.warn.mockClear();
});

it('should get component', () => {
  expect(getComponent('string').getMockName()).toEqual('StringType');
});

it('should not get component', () => {
  global.console = { warn: jest.fn() };
  expect(getComponent('unknown')()).toEqual(null);
  expect(console.warn).toHaveBeenCalledWith('type unknown is invalid');
});

describe('should get the right type', () => {
  it('any', () => {
    expect(getRightType('string', 'whatever')).toEqual('string');
  });
  it('file or image', () => {
    expect(getRightType('whatever', 'file')).toEqual('file');
  });
});

describe('should call the appropriate component', () => {
  it('Array', () => {
    const wrapper = shallow((
      <Type
        display_value={['array', 'value']}
        schema={{
          type: 'array',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<ArrayType />)).toBe(true);
  });
  it('Boolean', () => {
    const wrapper = shallow((
      <Type
        display_value={false}
        schema={{
          type: 'boolean',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<BooleanType />)).toBe(true);
  });
  it('File component', () => {
    const wrapper = shallow((
      <Type
        display_value={{ url: 'http://www.foo.fr/pdf.pdf' }}
        schema={{
          type: 'string',
        }}
        type="file"
      />
    ));
    expect(wrapper.matchesElement(<FileType />)).toBe(true);
  });
  it('Image component', () => {
    const wrapper = shallow((
      <Type
        display_value={{ url: 'http://www.foo.fr/img.jpg' }}
        schema={{
          type: 'string',
        }}
        type="image"
      />
    ));
    expect(wrapper.matchesElement(<FileType />)).toBe(true);
  });
  it('Number component', () => {
    const wrapper = shallow((
      <Type
        display_value={42.5}
        schema={{
          type: 'number',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<NumberType />)).toBe(true);
  });
  it('Integer component', () => {
    const wrapper = shallow((
      <Type
        display_value={42}
        schema={{
          type: 'number',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<NumberType />)).toBe(true);
  });
  it('Object component', () => {
    const wrapper = shallow((
      <Type
        display_value={{ foo: 'foo', bar: 'bar' }}
        schema={{
          type: 'object',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<ObjectType />)).toBe(true);
  });
  it('String component', () => {
    const wrapper = shallow((
      <Type
        display_value="String value"
        schema={{
          type: 'string',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<StringType />)).toBe(true);
  });
});
