import React from 'react';
import { connectAuthProvider, LoginForm } from '@terralego/core/modules/Auth';

import Header from './Header';
import Content from './Content';

import './styles.scss';

export const Main = ({ authenticated }) => (
  <div className="main">
    <Header />
    <div className="main-container">
      {authenticated
        ? <Content />
        : <LoginForm />
    }
    </div>
  </div>
);

export default connectAuthProvider('authenticated')(Main);
