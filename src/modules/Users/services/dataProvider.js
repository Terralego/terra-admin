// in src/dataProvider
import {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  DELETE,
} from 'react-admin';

import Api from 'mc-tf-test/modules/Api';

export default async (type, resource, params) => {
  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;
      const querystring = {
        page,
        limit: perPage,
      };
      const { results, count } = await Api.request(resource, {
        querystring,
      });
      return { data: results, total: count };
    }
    case GET_ONE: {
      const data = await Api.request(`${resource}/${params.id}/`);
      return { data };
    }
    case UPDATE: {
      const data = await Api.request(`${resource}/${params.id}/`, {
        method: 'PUT',
        body: params.data,
      });
      return { data };
    }
    case CREATE: {
      const data = await Api.request(`${resource}/`, {
        method: 'POST',
        body: params.data,
      });
      return { data };
    }
    case DELETE: {
      const data = await Api.request(`${resource}/${params.id}/`, {
        method: 'DELETE',
        body: params.data,
      });
      return { data };
    }
    default:
      return {};
  }
};
