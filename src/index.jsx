import './wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// D'anciennes versions enregistraient un service worker : on le retire chez
// les navigateurs qui l'ont encore
navigator.serviceWorker?.getRegistrations()
  .then(registrations => registrations.forEach(registration => registration.unregister()))
  .catch(() => {});
