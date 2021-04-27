import React from 'react';
import { useDataProvider } from 'react-admin';

const defaultSort = { field: 'id', order: 'DESC' };
const defaultFilter = {};
/**
 * Get all data accross pagination.
 * @param {*} resource resource name
 * @param {*} sort optionnal sort
 * @param {*} filter optionnal filter
 */
export const useGetListAllPages = (
  resource,
  perPage = 10,
  sort = defaultSort,
  filter = defaultFilter,
) => {
  const dataProvider = useDataProvider();
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const genQuery = page => ({
        pagination: { page, perPage },
        sort,
        filter,
      });

      // Get first page to know total
      const { data: firstPage, total } = await dataProvider.getList(resource, genQuery(1));

      if (!mounted) return;

      setData(firstPage);

      const pageCount = Math.ceil(total / perPage);

      const promises = Array.from({ length: pageCount - 1 }, async (_, index) => {
        const { data: nextPage } = await dataProvider.getList(resource, genQuery(index + 2));
        return nextPage;
      });

      const result = [
        firstPage,
        ...(await Promise.all(promises)),
      ];
      if (!mounted) return;

      setData(result.flat(1));

      setIsLoading(false);
    };
    loadData().catch(error => {
      // eslint-disable-next-line no-console
      console.log(error);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [dataProvider, resource, filter, perPage, sort]);

  return { data, isLoading };
};


export default { useGetListAllPages };
