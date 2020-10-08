import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { useDataProvider } from 'react-admin';
import { useField } from 'react-final-form';

import { RES_DATASOURCE } from '../../ra-modules';

/**
 * Returns the source data
 * @param {string} sourceFieldName
 */
export const useSourceData = sourceFieldName => {
  const { input: { value: sourceId } } = useField(sourceFieldName);
  const dataProvider = useDataProvider();

  const [sourceData, setSourceData] = React.useState({});
  const loadingRef = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;

    const loadSourceData = async () => {
      console.log('source called');
      const { data } = await dataProvider.getOne(RES_DATASOURCE, { id: sourceId });
      if (!isMounted) {
        return;
      }
      setSourceData(data);
      loadingRef.current = false;
    };

    if (sourceId && !loadingRef.current) {
      loadingRef.current = true;
      loadSourceData();
    }

    return () => {
      isMounted = false;
    };
  }, [dataProvider, sourceId]);

  return sourceData;
};


export default useSourceData;
