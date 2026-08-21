import { UPDATE } from 'react-admin';

import Api from '@terralego/core/modules/Api';
import toMultipart from './toMultipart';

jest.mock('@terralego/core/modules/Api', () => ({ request: jest.fn() }));
jest.mock('../../modules/RA/ra-modules', () => ({
  RES_DATASOURCE: 'datasource',
  RES_PICTURE: 'picture',
  RES_VIEW: 'view',
}));

const save = async data => {
  Api.request.mockResolvedValue({ id: 1 });
  await toMultipart(jest.fn())(UPDATE, 'view', { id: 1, data });

  const [, { body }] = Api.request.mock.calls[0];
  return body;
};

it('gives every related id its own part, as DRF reads them', async () => {
  const body = await save({ extra_extents: [2, 1] });

  expect(body.getAll('extra_extents')).toEqual(['2', '1']);
});

it('sends nothing rather than an empty part for an empty list', async () => {
  const body = await save({ extra_extents: [] });

  expect(body.getAll('extra_extents')).toEqual([]);
});

it('still serializes the nested config as json', async () => {
  const config = { map_settings: { extent_type: 'multiple' } };
  const body = await save({ config });

  expect(JSON.parse(body.get('config'))).toEqual(config);
});

it('leaves the other fields as they were', async () => {
  const body = await save({ name: 'Vue', order: 1, baselayer: [3, 1] });

  expect(body.get('name')).toEqual('Vue');
  expect(body.get('order')).toEqual('1');
  expect(JSON.parse(body.get('baselayer'))).toEqual([3, 1]);
});
