import i18n from '../../config/i18n';

export default locale => (i18n.getDataByLanguage(locale) || { translation: {} }).translation;
