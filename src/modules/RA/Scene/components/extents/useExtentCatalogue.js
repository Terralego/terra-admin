import { useMemo } from 'react';

import { useGetList } from 'react-admin';

import { RES_EXTENT } from '../../../ra-modules';

const PAGINATION = { page: 1, perPage: 500 };
const SORT = { field: 'name', order: 'ASC' };

const useExtentCatalogue = () => {
  const { data = {}, ids = [], loading } = useGetList(RES_EXTENT, PAGINATION, SORT);

  return useMemo(() => ({
    extents: ids.map(id => data[id]).filter(Boolean),
    byId: id => data[id],
    loading,
  }), [data, ids, loading]);
};

export default useExtentCatalogue;
