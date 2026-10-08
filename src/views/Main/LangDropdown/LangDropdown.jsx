import React from 'react';
import { useTranslation } from 'react-i18next';

/* eslint-disable import/no-extraneous-dependencies */
import MenuItem from '@material-ui/core/MenuItem';
import TranslateIcon from '@material-ui/icons/Translate';
/* eslint-enable */

import AppBarMenu from '../AppBarMenu';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

const LangDropdown = () => {
  const { i18n, t } = useTranslation();

  return (
    <AppBarMenu icon={<TranslateIcon />} label={t('common.languages')}>
      {close => LANGUAGES.map(({ code, label }) => (
        <MenuItem
          key={code}
          lang={code}
          selected={i18n.language === code}
          onClick={() => {
            i18n.changeLanguage(code);
            close();
          }}
        >
          {label}
        </MenuItem>
      ))}
    </AppBarMenu>
  );
};

export default LangDropdown;
