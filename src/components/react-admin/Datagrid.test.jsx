import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { getRowPath } from './Datagrid';

describe('getRowPath', () => {
  it('resout edit et show', () => {
    expect(getRowPath('edit', '/geolayer', 'geolayer', 12)).toBe('/geolayer/12');
    expect(getRowPath('show', '/geolayer', 'geolayer', 12)).toBe('/geolayer/12/show');
  });

  it('retombe sur la resource sans basePath', () => {
    expect(getRowPath('edit', undefined, 'geolayer', 12)).toBe('/geolayer/12');
  });

  it("n'ouvre rien pour les rowClick sans navigation", () => {
    expect(getRowPath('expand', '/geolayer', 'geolayer', 12)).toBeNull();
    expect(getRowPath('toggleSelection', '/geolayer', 'geolayer', 12)).toBeNull();
    expect(getRowPath(undefined, '/geolayer', 'geolayer', 12)).toBeNull();
    expect(getRowPath(() => '/ailleurs', '/geolayer', 'geolayer', 12)).toBeNull();
  });

  it('accepte un chemin explicite', () => {
    expect(getRowPath('/ailleurs', '/geolayer', 'geolayer', 12)).toBe('/ailleurs');
  });
});

// L'interception de NewTabAwareRow repose entierement sur ce comportement :
// stopPropagation en phase de capture doit neutraliser le onClick porte par le
// MEME element, celui que DatagridRow installe sur son <TableRow>.
it('stopPropagation en capture neutralise le onClick du meme element', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const onClick = vi.fn();
  const onClickCapture = vi.fn(event => event.stopPropagation());

  act(() => {
    ReactDOM.render(
      /* eslint-disable jsx-a11y/click-events-have-key-events,
         jsx-a11y/no-static-element-interactions */
      <div onClickCapture={onClickCapture} onClick={onClick}>cible</div>,
      div,
    );
  });

  act(() => {
    div.firstChild.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  expect(onClickCapture).toHaveBeenCalledTimes(1);
  expect(onClick).not.toHaveBeenCalled();
});
