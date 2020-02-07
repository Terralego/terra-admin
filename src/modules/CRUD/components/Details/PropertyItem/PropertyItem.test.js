import React from 'react';
import renderer from 'react-test-renderer';

import PropertyItem from './PropertyItem';

const t = text => text;

const properties = {
  Numéro: 2,
  Validation: true,
  Available: false,
  ArrayOfStrings: [1, 2, 3],
  ArrayOfObjects: [{ foo: 'Foo', bar: 'Bar' }, { test: 'footest' }],
  ArrayOfObjectsToTable: [
    { foo: 'FooItem', bar: 'BarItem', objectTest: { test: 'test' } },
    { foo: 'Foo2Item', bar: 'Bar2Item', objectTest: { test: 'test2' } },
  ],
  Object: { foobar: 'foobar', foobarbar: 'foobarbar' },
  EmptyValue: ' ',
};


it('should render correctly', () => {
  const tree = renderer.create((
    <ul>
      {Object.keys(properties).map(name => (
        <PropertyItem key={name} name={name} value={properties[name]} t={t} />
      ))}
    </ul>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
