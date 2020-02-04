import React, { useState } from 'react';
import connect from 'react-ctx-connect';

export const context = React.createContext({});
export const connectUserSettingsProvider = connect(context);

export const TABLE_MINIFIED = 'minified';
export const TABLE_MEDIUM = 'medium';
export const TABLE_FULL = 'full';

export const withTableFilters = () => connectUserSettingsProvider('tableFilters', 'setTableFilters');
export const withTableSize = () => connectUserSettingsProvider('tableSize', 'setTableSize');

const { Provider } = context;

export const UserSettingsProvider = ({ children }) => {
  const [tableSize, setTableSize] = useState(TABLE_MEDIUM);
  const [tableFilters, setTableFilters] = useState({});

  const value = {
    tableSize,
    setTableSize,
    tableFilters,
    setTableFilters,
  };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
};

export default UserSettingsProvider;
