import React from 'react';

import useAppSettings from './useAppSettings';

const defaultSpriteBaseUrl = 'https://makina-icon.netlify.app/sprite';

const useSprites = () => {
  const [iconChoices, setIconChoices] = React.useState([]);
  const { spriteBaseUrl = defaultSpriteBaseUrl } = useAppSettings();

  const loadIconChoices = React.useCallback(
    async () => {
      try {
        const response = await fetch(`${spriteBaseUrl}.json`);
        const data = await response.json();

        const choices = Object.entries(data)
          .map(([key, value]) => ({ id: key, name: key, ...value }))
          .sort(({ name: name1 }, { name: name2 }) => name1.localeCompare(name2));

        setIconChoices(choices);
      } catch (e) {
        console.error('Error while getting icons', e); // eslint-disable-line no-console
        setIconChoices([]);
      }
    },
    [spriteBaseUrl],
  );

  React.useEffect(() => { loadIconChoices(); }, [loadIconChoices]);

  return iconChoices;
};

export default useSprites;
