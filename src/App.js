import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './config/i18n';
import Main from './views/Main';

const App = () => (
  <BrowserRouter>
    <Main />
  </BrowserRouter>
);

export default App;
