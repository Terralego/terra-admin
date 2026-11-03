import React from 'react';
import { render } from '@testing-library/react';

import ExpertStyleField from './ExpertStyleField';

vi.mock('react-admin', () => ({ useTranslate: () => key => key }));

let validate;
vi.mock('../../../../../../components/react-admin/JSONInput', () => ({
  JSONInput: props => {
    ({ validate } = props);
    return null;
  },
}));

it('requires a type by default', () => {
  render(<ExpertStyleField source="main_style.map_style" />);
  expect(validate({ paint: {} })).toBe('ra.input.style_field.missing_property');
  expect(validate({ type: 'circle' })).toBeUndefined();
});

it('accepts a piechart advanced style without type', () => {
  render(<ExpertStyleField source="advanced_style" requireType={false} />);
  expect(validate({ fields: [], show_total: true })).toBeUndefined();
  expect(validate(undefined)).toBe('ra.input.style_field.empty_object');
});
