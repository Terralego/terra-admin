import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import MapExtentInput from './MapExtentInput';

const mocks = vi.hoisted(() => ({ catalogue: [], mapProps: null }));

vi.mock('./extents/ExtentMap', () => ({
  default: props => {
    mocks.mapProps = props;
    return null;
  },
}));
vi.mock('../../ra-modules', () => ({ RES_EXTENT: 'extent' }));

vi.mock('react-admin', () => ({
  useTranslate: () => (key, options) => (options ? `${key} ${JSON.stringify(options)}` : key),
  useGetList: () => ({
    data: mocks.catalogue.reduce((byId, extent) => ({ ...byId, [extent.id]: extent }), {}),
    ids: mocks.catalogue.map(({ id }) => id),
    loading: false,
  }),
}));

const CATALOGUE = [
  {
    id: 1,
    name: 'France métropolitaine',
    category: 'Métropole',
    icon: '/media/extents/metropole.svg',
    adaptToTheme: true,
    bbox: [-5, 41, 10, 51],
  },
  {
    id: 2,
    name: 'La Réunion',
    category: 'Outre-mer',
    icon: '/media/extents/reunion.svg',
    adaptToTheme: false,
    bbox: [55.2, -21.4, 55.9, -20.9],
  },
  {
    id: 3,
    name: 'Mayotte',
    category: 'Outre-mer',
    icon: '/media/extents/mayotte.svg',
    adaptToTheme: false,
    bbox: [45, -13, 45.3, -12.6],
  },
];

const BBOX = [-5, 41, 10, 51];

const mapSettings = state => state.values.config?.map_settings;

const renderInput = (initialValues = {}) => {
  const state = { values: null, errors: null };
  const view = render(
    <Form
      onSubmit={() => {}}
      initialValues={initialValues}
      render={({ values, errors }) => {
        state.values = values;
        state.errors = errors;
        return <MapExtentInput />;
      }}
    />,
  );
  return { ...view, state };
};

const withSettings = ({ extra_extents: extents, ...settings } = {}) => ({
  config: { map_settings: settings },
  ...(extents === undefined ? {} : { extra_extents: extents }),
});

const drawOnMap = bbox => act(() => mocks.mapProps.onChange(bbox));

const listItems = () => Array.from(
  screen.getByText('view.form.extent.list-title').parentElement.querySelectorAll('[role="button"]'),
);

const menuItems = () => screen.queryAllByRole('menuitem');

const pickMode = (container, mode) => {
  fireEvent.click(container.querySelector(`input[type="radio"][value="${mode}"]`));
};

const bulkAddButtons = () => Array.from(document.querySelectorAll('.MuiListSubheader-root button'));

const openPicker = () => {
  fireEvent.click(screen.getByText('view.form.extent.add'));
};

const addFromCatalogue = name => {
  openPicker();
  fireEvent.click(menuItems().find(item => item.textContent.includes(name)));
};

const clickAction = title => {
  fireEvent.click(screen.getByTitle(title).querySelector('button'));
};

beforeEach(() => {
  mocks.catalogue = CATALOGUE;
  mocks.mapProps = null;
});

describe('the single framing', () => {
  it('is still drawn by hand, and written where every front reads it', () => {
    const { state } = renderInput({});

    drawOnMap(BBOX);

    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
    expect(mapSettings(state).extent_type).toBeUndefined();
    expect(state.values.extra_extents).toBeUndefined();
  });

  it('survives a detour through the territory selector', () => {
    const { container, state } = renderInput(withSettings({
      extent_type: 'multiple',
      fitBounds: { coordinates: BBOX },
      extra_extents: [2, 3],
    }));

    pickMode(container, 'single');

    expect(state.values.extra_extents).toEqual([2, 3]);
    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
    expect(state.errors.config).toBeUndefined();
  });
});

describe('the bbox field of the single framing', () => {
  // Le TextField n'a pas d'id : son label n'est pas relié au champ
  const field = () => screen.getByPlaceholderText('-5.14, 41.36, 9.56, 51.09');

  const type = value => {
    fireEvent.change(field(), { target: { value } });
  };

  it('shows what the map has drawn', () => {
    renderInput(withSettings({ fitBounds: { coordinates: BBOX } }));

    expect(field().value).toEqual('-5, 41, 10, 51');
  });

  it('follows the map when it is drawn on', () => {
    renderInput({});

    drawOnMap(BBOX);

    expect(field().value).toEqual('-5, 41, 10, 51');
  });

  it('takes coordinates typed or pasted by hand', () => {
    const { state } = renderInput({});

    type('[55.2, -21.4, 55.9, -20.9]');

    expect(mapSettings(state).fitBounds).toEqual({ coordinates: [55.2, -21.4, 55.9, -20.9] });
    expect(mocks.mapProps.bbox).toEqual([55.2, -21.4, 55.9, -20.9]);
  });

  it('keeps an unfinished entry without touching the view', () => {
    const { state } = renderInput(withSettings({ fitBounds: { coordinates: BBOX } }));

    type('55.2, -21.4');

    expect(field().value).toEqual('55.2, -21.4');
    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
  });

  it('refuses coordinates that draw nothing', () => {
    const { state } = renderInput({});

    type('10, 41, -5, 91');

    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(mapSettings(state)?.fitBounds).toBeUndefined();
  });
});

describe('picking territories', () => {
  it('stores an id, not the territory itself', () => {
    const { state } = renderInput(withSettings({ extent_type: 'multiple' }));

    addFromCatalogue('La Réunion');

    expect(state.values.extra_extents).toEqual([2]);
  });

  it('shows the catalogue names and orders, first one being the main extent', () => {
    renderInput(withSettings({ extent_type: 'multiple', extra_extents: [3, 1] }));

    const items = listItems();
    expect(items).toHaveLength(2);
    expect(items[0].textContent).not.toContain('view.form.extent.unknown');
    expect(items[0].textContent).toContain('Mayotte');
    expect(items[0].textContent).toContain('view.form.extent.main');
    expect(items[1].textContent).toContain('France métropolitaine');
  });

  it('groups the catalogue by category', () => {
    renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker();

    const headers = Array.from(document.querySelectorAll('.MuiListSubheader-root'))
      .map(node => node.textContent);
    expect(headers).toEqual(['Métropole', 'Outre-mer']);
  });

  it('adds a whole category at once', () => {
    const { state } = renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker();
    fireEvent.click(bulkAddButtons()[0]);

    expect(state.values.extra_extents).toEqual([2, 3]);
  });

  it('writes nothing but the ids', () => {
    const { state } = renderInput(withSettings({ extent_type: 'multiple' }));

    addFromCatalogue('La Réunion');

    expect(state.values.extra_extents).toEqual([2]);
    expect(mapSettings(state).extent_type).toEqual('multiple');
  });

  it('offers no bulk add for what is already there', () => {
    renderInput(withSettings({ extent_type: 'multiple', extra_extents: [2] }));

    openPicker();

    expect(bulkAddButtons()).toHaveLength(0);
  });

  it('cannot pick the same territory twice', () => {
    renderInput(withSettings({ extent_type: 'multiple', extra_extents: [2] }));

    openPicker();

    const reunion = menuItems().find(item => item.textContent.includes('La Réunion'));
    expect(reunion.getAttribute('aria-disabled')).toBe('true');
  });

  it('reorders and removes without touching the catalogue', () => {
    const { state } = renderInput(withSettings({
      extent_type: 'multiple',
      extra_extents: [1, 2, 3],
    }));

    fireEvent.click(listItems()[2]);
    clickAction('view.form.extent.move-up');
    expect(state.values.extra_extents).toEqual([1, 3, 2]);

    clickAction('view.form.extent.delete');
    expect(state.values.extra_extents).toEqual([1, 2]);
  });

  it('offers no way to swap a territory for another', () => {
    renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1] }));

    expect(screen.getAllByText('view.form.extent.add')).toHaveLength(1);
  });

  it('takes the theme colour only when the catalogue asks for it', () => {
    renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1, 2] }));

    const [france, reunion] = listItems();
    expect(france.querySelector('img')).toBeNull();
    expect(reunion.querySelector('img').getAttribute('src')).toEqual('/media/extents/reunion.svg');
  });

  it('offers no way to rename or draw a territory', () => {
    const { container } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1] }));

    expect(container.querySelector('.MuiTextField-root')).toBeNull();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(mocks.mapProps.readOnly).toBe(true);
  });
});

describe('when the catalogue and the view disagree', () => {
  it('flags an id the catalogue does not know, without blocking the form', () => {
    const { state } = renderInput(withSettings({
      extent_type: 'multiple',
      extra_extents: [1, 404],
    }));

    expect(listItems()[1].textContent).toContain('view.form.extent.unknown');
    expect(state.errors.config).toBeUndefined();
  });

  it('blocks an empty selector', () => {
    const { state } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [] }));

    expect(state.errors.extra_extents).toBeTruthy();
  });

  it('says so when no territory is configured at all', () => {
    mocks.catalogue = [];
    renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker();

    expect(menuItems()[0].textContent).toContain('view.form.extent.empty');
  });
});
