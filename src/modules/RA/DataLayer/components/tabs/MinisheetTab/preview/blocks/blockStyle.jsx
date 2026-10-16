import React from 'react';
import Box from '@mui/material/Box';

/** Color setting (`color`, `customColor`) of the closest block holding others that has one. */
export const InheritedColorContext = React.createContext({});

/** Color setting of a block, that of its parent when it inherits it. */
export const useColorSetting = block => {
  const inherited = React.useContext(InheritedColorContext);
  return block.color === 'inherit' ? inherited : block;
};

/** Provides the color of a block to the blocks it holds. */
export const ColorProvider = ({ setting: { color, customColor }, children }) => {
  const value = React.useMemo(() => ({ color, customColor }), [color, customColor]);
  return <InheritedColorContext.Provider value={value}>{children}</InheritedColorContext.Provider>;
};

/** CSS color of a block `color` setting, or undefined for the default one. */
export const getColor = ({ color, customColor } = {}) => {
  if (!color) {
    return undefined;
  }
  return color === 'custom' ? customColor || undefined : `${color}.main`;
};

/** Value of a color given to `sx` (`primary.main`), for computations on it. */
export const resolveColor = (theme, color) => {
  const [key, shade] = color.split('.');
  return theme.palette[key]?.[shade] ?? color;
};

const isImageLink = value => /^(https?:|data:|\/)/i.test(value);

/** Icon of a block: an emoji or a link to an image, at the size of the text. */
export const BlockIcon = ({ icon }) => {
  const value = icon?.value?.trim();
  if (!value) {
    return null;
  }
  return isImageLink(value)
    ? <Box component="img" src={value} alt="" sx={{ height: '1.2em', verticalAlign: 'middle' }} />
    : <Box component="span" aria-hidden>{value}</Box>;
};
