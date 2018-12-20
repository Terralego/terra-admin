import React from 'react';
import { connectAuthProvider, LoginForm } from 'mc-tf-test/modules/Auth';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

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
    <Footer />
  </div>
);

export default connectAuthProvider('authenticated')(Main);
