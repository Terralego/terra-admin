import Api from 'mc-tf-test/modules/Api';

export const getSettings = async () => Api.request('settings');

export default getSettings;
