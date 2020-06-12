import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LoginForm } from '@terralego/core/modules/Auth';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import Header from './Header';
import Content from './Content';

import Message from '../../components/Message';

import './styles.scss';

export const Main = ({
  authenticated,
  locale,
  env: { title = 'Terralego Admin', favicon, language } = {},
  errorSettings: { message: errorMessage },
}) => {
  const { i18n, t } = useTranslation();


  useEffect(() => {
    if (!language) return;
    i18n.changeLanguage(language);
  }, [i18n, language]);

  if (errorMessage) {
    return (
      <Message intent="danger">
        <p>{t('common.error.unableToLoadSettings')}</p>
        {errorMessage}
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
          : <LoginForm translate={t} />}
      </div>
    </div>
  );
};

Main.propTypes = {
  authenticated: PropTypes.bool,
  locale: PropTypes.string,
  env: PropTypes.shape({
    title: PropTypes.string,
    favicon: PropTypes.string,
  }),
  errorSettings: PropTypes.shape({
    message: PropTypes.string,
  }),
};

Main.defaultProps = {
  authenticated: false,
  locale: 'en',
  env: {
    title: 'Terralego Admin',
    favicon: undefined,
  },
  errorSettings: {
    message: undefined,
  },
};

export default Main;
