import Api from '@terralego/core/modules/Api';

let datalayerconfig = null;

export const fetchDatalayerConfig = async () => {
  if (datalayerconfig === null) {
    const apiViews =  await Api.request('geolayer/view/');

    datalayerconfig = Object.entries(apiViews)
      .map(elt => {
        const [key, { pk, ...rest }] = elt;
        return { ...rest, id: pk, key };
      })
      .sort(({ id: idA }, { id: idB }) => idA - idB);
  }

  return datalayerconfig;
};
export default { fetchDatalayerConfig };
