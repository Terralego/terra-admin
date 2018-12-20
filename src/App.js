import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from 'mc-tf-test/modules/Api';
import AuthProvider from 'mc-tf-test/modules/Auth';

import './config/i18n';
import Main from './views/Main';

const App = () => (
  <BrowserRouter>
    <ApiProvider host={process.env.REACT_APP_API_HOST}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </ApiProvider>
  </BrowserRouter>
);

export default App;
