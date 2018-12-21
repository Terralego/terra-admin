import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from 'mc-tf-test/modules/Api';
import AuthProvider from 'mc-tf-test/modules/Auth';

import './config/i18n';
import AppProvider from './components/AppProvider';
import Main from './views/Main';

const App = () => (
  <BrowserRouter>
    <AppProvider>
      {({ API_HOST }) => (
        <ApiProvider host={API_HOST}>
          <AuthProvider>
            <Main />
          </AuthProvider>
        </ApiProvider>
      )}
    </AppProvider>
  </BrowserRouter>
);

export default App;
