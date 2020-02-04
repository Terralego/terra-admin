import React, { useEffect, useState } from 'react';
import connect from 'react-ctx-connect';

export const context = React.createContext({});
export const connectUserSettingsProvider = connect(context);

export const TABLE_MINIFIED = 'minified';
export const TABLE_MEDIUM = 'medium';
export const TABLE_FULL = 'full';

export const withTableFilters = () => connectUserSettingsProvider('tableFilters', 'setTableFilters');
export const withTableSize = () => connectUserSettingsProvider('tableSize', 'setTableSize');

const { Provider } = context;

const userSettings = JSON.parse(localStorage.getItem('CRUDUserSettings')) || {};
export const getUserSetting = key => userSettings[key];

export const UserSettingsProvider = ({ children }) => {
  const [tableFilters, setTableFilters] = useState(getUserSetting('tableFilters') || {
    page_size: 10,
  });
  const [tableSize, setTableSize] = useState(getUserSetting('tableSize') || TABLE_MEDIUM);


  useEffect(() => {
    localStorage.setItem('CRUDUserSettings', JSON.stringify({
      ...userSettings,
      tableFilters,
      tableSize,
    }));
  }, [tableFilters, tableSize]);

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
