/* eslint-disable no-param-reassign */

import { GET_ONE, CREATE, UPDATE } from 'react-admin';

import { RES_DATALAYER } from '../../modules/RA/ra-modules';

const patchPictureDataProvider = nextDataProvider => async (type, resource, params, meta) => {
  /** Decorator to patch datalayer while updating backend */

  if (resource === RES_DATALAYER) {
    switch (type) {
      case GET_ONE:
        return nextDataProvider(type, resource, params, meta).then(modifiedResult => {
          console.log('get', modifiedResult);
          if (!modifiedResult.data.main_style.type) {
            const mainStyle = {
              type: 'advanced' || modifiedResult.data.main_style?.type,
              classes_count: 5,
              style: {},
              map_style: modifiedResult.data.layer_style,
            };
            modifiedResult.data.main_style = mainStyle;
          }
          if ((modifiedResult.data.custom_styles || []).length > 0 && modifiedResult.data.extra_styles.length === 0) {
            const extraStyles = modifiedResult.data.custom_styles.map(layerStyle => ({
              style_config: {
                type: 'advanced',
                classes_count: 5,
                style: {},
                map_style: { ...layerStyle.style },
              },
              source: layerStyle.source,
            }));

            modifiedResult.data.extra_styles = extraStyles;
          }
          console.log('after', modifiedResult);

          return modifiedResult;
        });
      case CREATE:
      case UPDATE:
        console.log('before', params.data);
        params.data.layer_style = params.data.main_style.map_style;
        params.data.custom_styles = params.data.extra_styles.map(extraStyle =>
          ({ source: extraStyle.source, style: extraStyle.style_config.map_style }));
        console.log('after', params.data);
        break;
      default:
        break;
    }
  }
  /**
   * Continue to next dataProvider
   */
  return nextDataProvider(type, resource, params, meta);
};

export default patchPictureDataProvider;
