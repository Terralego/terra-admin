import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';

// Dependances transitives de react-admin, qui s'en sert pour ses ArrayInput
/* eslint-disable import/no-extraneous-dependencies */
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
/* eslint-enable import/no-extraneous-dependencies */

import JSONInput from './JSONInput';

// CodeMirror expose son instance sur l'element racine qu'il cree
const editorOf = div => div.querySelector('.CodeMirror').CodeMirror;

const setup = (initialValues = {}) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const state = {};

  act(() => {
    ReactDOM.render(
      <Form
        onSubmit={() => {}}
        initialValues={initialValues}
        render={({ values, form }) => {
          state.values = values;
          state.form = form;
          return <JSONInput source="properties" label="lbl" />;
        }}
      />,
      div,
    );
  });

  return { div, state, editor: editorOf(div) };
};

const type = (editor, value) => {
  act(() => {
    editor.focus();
    editor.setValue(value);
  });
};

it('affiche la valeur formatee', () => {
  const { editor } = setup({ properties: { a: 1 } });
  expect(editor.getValue()).toBe('{\n  "a": 1\n}');
});

it('remonte le JSON valide au formulaire', () => {
  const { state, editor } = setup({ properties: { a: 1 } });
  type(editor, '{"b": 2}');
  expect(state.values.properties).toEqual({ b: 2 });
});

it('conserve la derniere valeur valide et signale le JSON casse', () => {
  const { div, state, editor } = setup({ properties: { a: 1 } });
  type(editor, '{"b": ');
  expect(state.values.properties).toEqual({ a: 1 });
  expect(editor.getValue()).toBe('{"b": ');
  expect(div.textContent).toMatch(/ra\.input\.json\.invalid/);
});

it('se resynchronise quand la valeur change depuis le formulaire', () => {
  const { state, editor } = setup({ properties: { a: 1 } });
  act(() => { state.form.change('properties', { loaded: true }); });
  expect(editor.getValue()).toBe('{\n  "loaded": true\n}');
});

// Reproduit WidgetsTab : le meme champ porte un ArrayInput ET le JSONInput, et
// `initialValue={[]}` y est recree a chaque rendu.
it('ne boucle pas sur un champ partage avec un ArrayInput', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  act(() => {
    ReactDOM.render(
      <Form
        onSubmit={() => {}}
        mutators={{ ...arrayMutators }}
        initialValues={{ widgets: [] }}
        render={() => (
          <>
            <FieldArray name="widgets">
              {({ fields }) => <div>{fields.map(name => <span key={name}>{name}</span>)}</div>}
            </FieldArray>
            <JSONInput source="widgets" initialValue={[]} label="w" />
          </>
        )}
      />,
      div,
    );
  });

  const editor = editorOf(div);
  expect(editor.getValue()).toBe('[]');
  expect(() => type(editor, '[')).not.toThrow();
  expect(editor.getValue()).toBe('[');
});
