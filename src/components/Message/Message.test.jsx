import React from 'react';
import renderer from 'react-test-renderer';

import Message from './Message';

it('should render correctly', () => {
  const tree = renderer.create((
    <Message>
      Lorem ipsum dolor sit amet.
    </Message>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should not render anything', () => {
  const tree = renderer.create((
    <Message />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
