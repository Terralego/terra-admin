import React, { useState } from 'react';
import connect from 'react-ctx-connect';

export const context = React.createContext({});
export const connectUserSettingsProvider = connect(context);

export const TABLE_MINIFIED = 'minified';
export const TABLE_MEDIUM = 'medium';
export const TABLE_FULL = 'full';

export const withPageSize = () => connectUserSettingsProvider('pageSize', 'setPageSize');
export const withTableSize = () => connectUserSettingsProvider('tableSize', 'setTableSize');

const { Provider } = context;

export const UserSettingsProvider = ({ children }) => {
  const [pageSize, setPageSize] = useState(10);
  const [tableSize, setTableSize] = useState(TABLE_MEDIUM);

  const value = {
    pageSize,
    setPageSize,
    tableSize,
    setTableSize,
  };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
};

export default UserSettingsProvider;
