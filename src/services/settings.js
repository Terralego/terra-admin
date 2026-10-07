import Api from '../terra-front/Api';

export const getSettings = async () => Api.request('settings/');

export default getSettings;
