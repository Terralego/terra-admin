import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApiProvider } from './terra-front/Api';
import AuthProvider from './terra-front/Auth';

import './config/i18n';
import AppProvider from './components/AppProvider';
import SearchProvider from './components/SearchProvider';
import Main from './views/Main';

import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { BetaProvider } from './hooks/useBeta';


const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ApiProvider host="/api">
      <AppProvider>
        <SearchProvider host="/elasticsearch">
          <AuthProvider>
            <BetaProvider>
              <Main />
            </BetaProvider>
          </AuthProvider>
        </SearchProvider>
      </AppProvider>
    </ApiProvider>
  </BrowserRouter>
);

export default App;
