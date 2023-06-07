import React, { useContext, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { LoginForm } from '@terralego/core/modules/Auth';
import { context as AuthContext } from '@terralego/core/modules/Auth/services/context';

import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

import { AppContext } from '../../components/AppProvider';

import Header from './Header';
import Content from './Content';

import Message from '../../components/Message';

import './styles.scss';

export const Main = ({ locale }) => {
  const { i18n, t } = useTranslation();

  const { authenticated } = useContext(AuthContext);

  const {
    env: { title = 'Terralego Admin', favicon, language, ssoAuth } = {},
    errorSettings: { message: errorMessage } = {},
  } = useContext(AppContext);

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
          : <LoginForm translate={t} ssoLink={ssoAuth?.loginUrl} />}
      </div>
    </div>
  );
};

Main.propTypes = {
  locale: PropTypes.string,
};

Main.defaultProps = {
  locale: 'en',
};

export default memo(Main);
