import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import PiePieceStyleField from './PiePieceStyleField';

vi.mock('react-admin', () => ({ useTranslate: () => key => key }));
vi.mock('../../../../../../../components/react-admin/ColorPicker', () => ({ default: () => null }));

const FIELDS = [
  { name: 'pop', label: 'Population', data_type: 2 },
  { name: 'area', label: 'Surface', data_type: 3 },
];

it('renders without looping', () => {
  let renders = 0;
  render(
    <Form
      onSubmit={() => {}}
      initialValues={{ name: 'layer' }}
      render={() => {
        renders += 1;
        if (renders > 200) throw new Error('render loop');
        return <PiePieceStyleField path="main_style.advanced_style" fields={FIELDS} />;
      }}
    />,
  );
  expect(renders).toBeLessThan(50);
});
