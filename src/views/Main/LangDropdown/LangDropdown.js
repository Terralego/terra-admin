import React from 'react';
import { Button, Classes, Popover, Menu, MenuItem, Position } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';

const LangDropdown = () => {
  const { i18n, t } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };
  const languages = [
    { en: 'English' },
    { fr: 'Français' },
  ];
  return (
    <Popover
      content={(
        <Menu>
          {languages.map(lang => {
            const [[key, value]] = Object.entries(lang);
            return (
              <MenuItem
                active={i18n.language === key}
                className={Classes.MINIMAL}
                key={key}
                onClick={() => changeLanguage(key)}
                lang={key}
                text={value}
              />
            );
          })}
        </Menu>
      )}
      position={Position.BOTTOM_RIGHT}
    >
      <Button
        className={Classes.MINIMAL}
        icon="translate"
        rightIcon="caret-down"
        text={t('common.languages')}
      />
    </Popover>
  );
};

export default LangDropdown;
