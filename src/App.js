import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from 'mc-tf-test/modules/Api';
import AuthProvider from 'mc-tf-test/modules/Auth';

import './config/i18n';
import AppProvider from './components/AppProvider';
import Main from './views/Main';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'normalize.css';

const { PUBLIC_URL } = process.env;

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <ApiProvider host="/api">
      <AppProvider>
        <AuthProvider>
          <Main />
        </AuthProvider>
      </AppProvider>
    </ApiProvider>
  </BrowserRouter>
);

export default App;
