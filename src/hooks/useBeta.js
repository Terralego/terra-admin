import React from 'react';
import { useLocation } from 'react-router-dom';

const BetaContext = React.createContext(false);

const useQuery = () => new URLSearchParams(useLocation().search);

export const BetaProvider = ({ children }) => {
  const query = useQuery();
  const [isBeta, setIsBeta] = React.useState(false);

  const forceBeta = query.get('beta') === 'true';

  React.useEffect(() => {
    if (forceBeta) {
      setIsBeta(true);
    }
  }, [forceBeta, setIsBeta]);

  return <BetaContext.Provider value={isBeta}>{children}</BetaContext.Provider>;
};

const useBeta = () => React.useContext(BetaContext);

export default useBeta;
