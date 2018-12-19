import React from 'react';

import Header from './Header';
import Nav from './Nav';
import Content from './Content';
import Footer from './Footer';

import './styles.scss';

export const Main = () => (
  <div className="main">
    <Header />
    <div className="main-container">
      <Nav />
      <Content />
    </div>
    <Footer />
  </div>
);

export default Main;
