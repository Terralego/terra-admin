import Api from '@terralego/core/modules/Api';

export const getSettings = async () => Api.request('settings');

export default getSettings;
