import React from 'react';

export const ICONS_ROOT = '/media/icon-libraries';

function useFetchIconLibraryIndex (shouldFetch = true) {
  const [libraryIndex, setLibraryIndex] = React.useState({ status: 'idle' });

  React.useEffect(() => {
    if (shouldFetch) {
      setLibraryIndex({
        status: 'loading',
      });
      fetch(`${ICONS_ROOT}/index.json`)
        .then(r => r.json())
        .then(result => setLibraryIndex({ status: 'success', data: result }))
        .catch(() => setLibraryIndex({ status: 'error' }));
    }
  }, [shouldFetch]);

  return libraryIndex;
}

export default useFetchIconLibraryIndex;
