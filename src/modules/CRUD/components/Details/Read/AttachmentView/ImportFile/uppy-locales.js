import en from '@uppy/locales/src/en_US';
import fr from '@uppy/locales/src/fr_FR';
// See https://uppy.io/docs/locales/#List-of-locale-packs for more locales

const locales = {
  en,
  fr,
  default: en,
};

export const getLocale = language => locales[language] || locales[language.split('-')[0]] || locales.default;

export default locales;
