import { useGetList } from 'ra-core';
import React from 'react';
import { RES_ICON } from '../modules/RA/ra-modules';

const useCustomStyleImages = () => {
  const { data, ids } = useGetList(RES_ICON);

  const customImages = React.useMemo(
    () => {
      const styleImages = ids.map(i => data[i]);
      return styleImages
      ?.filter(({ name, slug, file } = {}) => Boolean(name && slug && file));
    },
    [data, ids],
  );

  return customImages || [];
};

export default useCustomStyleImages;
