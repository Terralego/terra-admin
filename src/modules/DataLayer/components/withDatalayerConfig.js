import React from 'react';
import { fetchDatalayerConfig } from '../services/datalayer';


export const withDatalayerConfig = WrappedComponent => props => {
  /** Injects the datalayerConfig as prop to the wrapped component */
  const [datalayerConfig, setDatalayerConfig] = React.useState([]);
  let isUnmounted = false;

  const fetchConfig = async () => {
    const choices = await fetchDatalayerConfig();
    if (isUnmounted) return;
    setDatalayerConfig(choices);
  };

  React.useEffect(() => {
    fetchConfig();

    return () => {
      isUnmounted = true;
    };
  }, []);

  return (
    <WrappedComponent
      {...props}
      datalayerConfig={datalayerConfig}
    />
  );
};

export default withDatalayerConfig;
