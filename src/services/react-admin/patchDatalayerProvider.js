/* eslint-disable no-param-reassign */

import { GET_ONE, CREATE, UPDATE } from 'react-admin';

import { RES_DATALAYER } from '../../modules/RA/ra-modules';

const patchPictureDataProvider = nextDataProvider => async (type, resource, params, meta) => {
  /** Decorator to patch datalayer while updating backend */

  if (resource === RES_DATALAYER) {
    switch (type) {
      case GET_ONE:
        return nextDataProvider(type, resource, params, meta).then(modifiedResult => {
          const mainStyle = {
            analysis: 'advanced',
            classes_count: 5,
            style: { fill_color: [] },
            map_style: modifiedResult.data.layer_style,
          };
          const extraStyles = modifiedResult.data.custom_styles.map(layerStyle => ({
            style_config: {
              analysis: 'advanced',
              classes_count: 5,
              style: { fill_color: [] },
              map_style: { ...layerStyle.style },
            },
            source: layerStyle.source,
          }));

          modifiedResult.data.settings.main_style = mainStyle;
          modifiedResult.data.settings.extra_styles = extraStyles;

          return modifiedResult;
        });
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
