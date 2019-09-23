import React from 'react';
import { fetchViewList } from '../services/datalayer';


export const withViewList = WrappedComponent => props => {
  /** Injects the viewList as prop to the wrapped component */
  const [viewList, setViewList] = React.useState([]);
  const isUnmounted = React.useRef(false);

  const fetchList = async () => {
    const loadedViewList = await fetchViewList();
    if (isUnmounted.current) return;
    setViewList(loadedViewList);
  };

  React.useEffect(() => {
    fetchList();

    return () => {
      isUnmounted.current = true;
    };
  }, []);

  return (
    <WrappedComponent
      {...props}
      viewList={viewList}
    />
  );
};

export default withViewList;
