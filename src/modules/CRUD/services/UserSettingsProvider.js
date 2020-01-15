import React, { useState } from 'react';
import connect from 'react-ctx-connect';

export const context = React.createContext({});
export const connectUserSettingsProvider = connect(context);

export const withPageSize = () =>
  connectUserSettingsProvider('pageSize', 'setPageSize');

const { Provider } = context;

export const UserSettingsProvider = ({ children }) => {
  const [pageSize, setPageSize] = useState(10);

  const value = {
    pageSize,
    setPageSize,
  };

  return (
    <Provider value={value}>
      {children}
    </Provider>
  );
};

export default UserSettingsProvider;
