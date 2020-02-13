/* eslint-disable no-console */
import React from 'react';
import { shallow } from 'enzyme';

import Type, { getComponent } from './Type';

import BooleanType from './BooleanType';
import StringType from './StringType';

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

describe('should call the appropriate component', () => {
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
  it('Number component', () => {
    const wrapper = shallow((
      <Type
        display_value={42}
        schema={{
          type: 'number',
        }}
        type="string"
      />
    ));
    expect(wrapper.matchesElement(<StringType />)).toBe(true);
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
