import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from '@terralego/core/modules/Api';
import AuthProvider from '@terralego/core/modules/Auth';

import './config/i18n';
import AppProvider from './components/AppProvider';
import Main from './views/Main';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import 'normalize.css';
import { BetaProvider } from './hooks/useBeta';

const { PUBLIC_URL } = process.env;

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <ApiProvider host="/api">
      <AppProvider>
        <AuthProvider>
          <BetaProvider>
            <Main />
          </BetaProvider>
        </AuthProvider>
      </AppProvider>
    </ApiProvider>
  </BrowserRouter>
);

export default App;
