import React from 'react';
import { withNamespaces } from 'react-i18next';
import { connectAuthProvider, LoginForm } from '@terralego/core/modules/Auth';

import Header from './Header';
import Content from './Content';

import './styles.scss';

export const Main = ({ authenticated, t }) => (
  <div className="main">
    <Header />
    <div className="main-container">
      {authenticated
        ? <Content />
        : <LoginForm translate={t} />
    }
    </div>
  </div>
);

export default withNamespaces()(
  connectAuthProvider('authenticated')(
    Main,
  ),
);
