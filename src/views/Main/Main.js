import React from 'react';
import { LoginForm } from '@terralego/core/modules/Auth';
import Helmet from 'react-helmet';

import Header from './Header';
import Content from './Content';

import Message from '../../components/Message';

import './styles.scss';

export const Main = ({
  authenticated,
  locale,
  env: { title = 'Terralego Admin', favicon } = {},
  errorSettings,
  t,
}) => {
  if (errorSettings) {
    return (
      <Message intent="danger">
        <p>{t('common.error.unableToLoadSettings')}</p>
        {errorSettings.message}
      </Message>
    );
  }
  return (
    <div className="main">
      <Helmet>
        <html lang={locale} prefix="og:http://ogp.me/ns#" />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={global.location.href} />
        {!!favicon && (
        <link rel="shortcut icon" href={favicon} />
        )}
      </Helmet>
      <Header />
      <div className="main-container">
        {authenticated
          ? <Content />
          : <LoginForm translate={t} />
    }
      </div>
    </div>
  );
};

export default Main;
