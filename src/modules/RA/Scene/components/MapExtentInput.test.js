import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { Form } from 'react-final-form';

import MapExtentInput from './MapExtentInput';

jest.mock('./extents/ExtentMap', () => function ExtentMap () { return null; });
jest.mock('../../ra-modules', () => ({ RES_EXTENT: 'extent' }));

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

let mockCatalogue = CATALOGUE;

jest.mock('react-admin', () => ({
  useTranslate: () => (key, options) => (options ? `${key} ${JSON.stringify(options)}` : key),
  useGetList: () => ({
    data: mockCatalogue.reduce((byId, extent) => ({ ...byId, [extent.id]: extent }), {}),
    ids: mockCatalogue.map(({ id }) => id),
    loading: false,
  }),
}));

const BBOX = [-5, 41, 10, 51];

const mapSettings = state => state.values.config?.map_settings;

const renderInput = (initialValues = {}) => {
  const state = { values: null, errors: null };
  const wrapper = mount(
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
  return { wrapper, state };
};

const withSettings = ({ extra_extents: extents, ...settings } = {}) => ({
  config: { map_settings: settings },
  ...(extents === undefined ? {} : { extra_extents: extents }),
});

const listItems = wrapper => wrapper.find('ExtentList').find('ForwardRef(ListItem)');

const menuItems = wrapper => wrapper.find('li[role="menuitem"]');

const pickMode = (wrapper, mode) => {
  act(() => {
    wrapper.find(`input[type="radio"][value="${mode}"]`).simulate('change', { target: { value: mode } });
  });
  wrapper.update();
};

const bulkAdd = wrapper => wrapper.find('ForwardRef(ListSubheader)').find('button');

const openPicker = wrapper => {
  act(() => {
    wrapper.find('ExtentPicker').find('button').first().simulate('click');
  });
  wrapper.update();
};

const addFromCatalogue = (wrapper, name) => {
  openPicker(wrapper);
  act(() => {
    menuItems(wrapper).filterWhere(node => node.text().includes(name)).first().simulate('click');
  });
  wrapper.update();
};

beforeEach(() => {
  mockCatalogue = CATALOGUE;
});

describe('the single framing', () => {
  it('is still drawn by hand, and written where every front reads it', () => {
    const { wrapper, state } = renderInput({});

    act(() => {
      wrapper.find('ExtentMap').prop('onChange')(BBOX);
    });
    wrapper.update();

    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
    expect(mapSettings(state).extent_type).toBeUndefined();
    expect(state.values.extra_extents).toBeUndefined();
  });

  it('survives a detour through the territory selector', () => {
    const { wrapper, state } = renderInput(withSettings({
      extent_type: 'multiple',
      fitBounds: { coordinates: BBOX },
      extra_extents: [2, 3],
    }));

    pickMode(wrapper, 'single');

    expect(state.values.extra_extents).toEqual([2, 3]);
    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
    expect(state.errors.config).toBeUndefined();
  });
});

describe('the bbox field of the single framing', () => {
  const field = wrapper => wrapper.find('BboxInput').find('input');

  const type = (wrapper, value) => {
    act(() => {
      field(wrapper).simulate('change', { target: { value } });
    });
    wrapper.update();
  };

  it('shows what the map has drawn', () => {
    const { wrapper } = renderInput(withSettings({ fitBounds: { coordinates: BBOX } }));

    expect(field(wrapper).prop('value')).toEqual('-5, 41, 10, 51');
  });

  it('follows the map when it is drawn on', () => {
    const { wrapper } = renderInput({});

    act(() => {
      wrapper.find('ExtentMap').prop('onChange')(BBOX);
    });
    wrapper.update();

    expect(field(wrapper).prop('value')).toEqual('-5, 41, 10, 51');
  });

  it('takes coordinates typed or pasted by hand', () => {
    const { wrapper, state } = renderInput({});

    type(wrapper, '[55.2, -21.4, 55.9, -20.9]');

    expect(mapSettings(state).fitBounds).toEqual({ coordinates: [55.2, -21.4, 55.9, -20.9] });
    expect(wrapper.find('ExtentMap').prop('bbox')).toEqual([55.2, -21.4, 55.9, -20.9]);
  });

  it('keeps an unfinished entry without touching the view', () => {
    const { wrapper, state } = renderInput(withSettings({ fitBounds: { coordinates: BBOX } }));

    type(wrapper, '55.2, -21.4');

    expect(field(wrapper).prop('value')).toEqual('55.2, -21.4');
    expect(wrapper.find('BboxInput').find('ForwardRef(TextField)').prop('error')).toBe(true);
    expect(mapSettings(state).fitBounds).toEqual({ coordinates: BBOX });
  });

  it('refuses coordinates that draw nothing', () => {
    const { wrapper, state } = renderInput({});

    type(wrapper, '10, 41, -5, 91');

    expect(wrapper.find('BboxInput').find('ForwardRef(TextField)').prop('error')).toBe(true);
    expect(mapSettings(state)?.fitBounds).toBeUndefined();
  });
});

describe('picking territories', () => {
  it('stores an id, not the territory itself', () => {
    const { wrapper, state } = renderInput(withSettings({ extent_type: 'multiple' }));

    addFromCatalogue(wrapper, 'La Réunion');

    expect(state.values.extra_extents).toEqual([2]);
  });

  it('shows the catalogue names and orders, first one being the main extent', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [3, 1] }));

    expect(listItems(wrapper)).toHaveLength(2);
    expect(listItems(wrapper).at(0).text()).not.toContain('view.form.extent.unknown');
    expect(listItems(wrapper).at(0).text()).toContain('Mayotte');
    expect(listItems(wrapper).at(0).text()).toContain('view.form.extent.main');
    expect(listItems(wrapper).at(1).text()).toContain('France métropolitaine');
  });

  it('groups the catalogue by category', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker(wrapper);

    const headers = wrapper.find('ForwardRef(ListSubheader)').map(node => node.text());
    expect(headers).toEqual(['Métropole', 'Outre-mer']);
  });

  it('adds a whole category at once', () => {
    const { wrapper, state } = renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker(wrapper);
    act(() => {
      bulkAdd(wrapper).first().simulate('click');
    });
    wrapper.update();

    expect(state.values.extra_extents).toEqual([2, 3]);
  });

  it('writes nothing but the ids', () => {
    const { wrapper, state } = renderInput(withSettings({ extent_type: 'multiple' }));

    addFromCatalogue(wrapper, 'La Réunion');

    expect(state.values.extra_extents).toEqual([2]);
    expect(mapSettings(state).extent_type).toEqual('multiple');
  });

  it('offers no bulk add for what is already there', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [2] }));

    openPicker(wrapper);

    expect(bulkAdd(wrapper)).toHaveLength(0);
  });

  it('cannot pick the same territory twice', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [2] }));

    openPicker(wrapper);

    const reunion = menuItems(wrapper).filterWhere(node => node.text().includes('La Réunion'));
    expect(reunion.first().prop('aria-disabled')).toBe(true);
  });

  it('reorders and removes without touching the catalogue', () => {
    const { wrapper, state } = renderInput(withSettings({
      extent_type: 'multiple',
      extra_extents: [1, 2, 3],
    }));

    act(() => {
      listItems(wrapper).at(2).simulate('click');
    });
    wrapper.update();
    act(() => {
      wrapper.find('Action[title="view.form.extent.move-up"]').find('button').simulate('click');
    });
    wrapper.update();
    expect(state.values.extra_extents).toEqual([1, 3, 2]);

    act(() => {
      wrapper.find('Action[title="view.form.extent.delete"]').find('button').simulate('click');
    });
    wrapper.update();
    expect(state.values.extra_extents).toEqual([1, 2]);
  });

  it('offers no way to swap a territory for another', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1] }));

    expect(wrapper.find('ExtentPicker')).toHaveLength(1);
    expect(wrapper.find('ExtentPreview').find('ExtentPicker')).toHaveLength(0);
  });

  it('takes the theme colour only when the catalogue asks for it', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1, 2] }));

    const icons = wrapper.find('ExtentList').find('ExtentIcon');
    expect(icons.at(0).find('img')).toHaveLength(0);
    expect(icons.at(1).find('img').prop('src')).toEqual('/media/extents/reunion.svg');
  });

  it('offers no way to rename or draw a territory', () => {
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [1] }));

    expect(wrapper.find('ForwardRef(TextField)')).toHaveLength(0);
    expect(wrapper.find('input[type="file"]')).toHaveLength(0);
    expect(wrapper.find('ExtentMap').prop('readOnly')).toBe(true);
  });
});

describe('when the catalogue and the view disagree', () => {
  it('flags an id the catalogue does not know, without blocking the form', () => {
    const { wrapper, state } = renderInput(withSettings({
      extent_type: 'multiple',
      extra_extents: [1, 404],
    }));

    expect(listItems(wrapper).at(1).text()).toContain('view.form.extent.unknown');
    expect(state.errors.config).toBeUndefined();
  });

  it('blocks an empty selector', () => {
    const { state } = renderInput(withSettings({ extent_type: 'multiple', extra_extents: [] }));

    expect(state.errors.extra_extents).toBeTruthy();
  });

  it('says so when no territory is configured at all', () => {
    mockCatalogue = [];
    const { wrapper } = renderInput(withSettings({ extent_type: 'multiple' }));

    openPicker(wrapper);

    expect(menuItems(wrapper).first().text()).toContain('view.form.extent.empty');
  });
});
