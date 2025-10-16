import { useTranslate } from 'ra-core';
import React from 'react';
import { Box } from '@material-ui/core';
import useSprites from './useSprites';
import useCustomStyleImages from './useCustomStyleImages';
import useFetchIconLibraryIndex from './useFetchIconLibraryIndex';

function useStyleImagesOptions () {
  const translate = useTranslate();
  const defaultSprites = useSprites();
  const customStyleImages = useCustomStyleImages();
  const libraryIndex = useFetchIconLibraryIndex();

  const customStyleImagesChoices = React.useMemo(
    () => {
      // Make sure all icons from the same source are one after the other
      customStyleImages.sort((a, b) => {
        if (a.source !== b.source) {
          return a.source > b.source;
        }
        return a.name > b.name;
      });
      let currentSource = null;
      const result = [];
      result.push(...customStyleImages.map(customImage => {
        const items = [];
        // The source changed, add the section header
        if (customImage.source !== currentSource) {
          currentSource = customImage.source;
          if (currentSource === '') {
            items.push({
              id: 'separator-custom',
              name: translate('style-editor.icon.icon-image-custom'),
              disabled: true,
            });
          } else {
            const sourceName = libraryIndex.data
              ? libraryIndex.data.find(l => l.id === currentSource)?.name : undefined;
            items.push({
              id: `separator-library-${currentSource}`,
              name: sourceName ?? currentSource,
              disabled: true,
            });
          }
        }

        items.push(({
          id: customImage.slug,
          name: (
            <>
              {customImage.name}
              <Box
                component="img"
                src={customImage.file}
                sx={{ maxWidth: 24, maxHeight: 24, ml: 'auto' }}
              />
            </>
          ),
        }));
        return items;
      }).flat());
      return result;
    },
    [customStyleImages, translate, libraryIndex.data],
  );

  const iconChoices = React.useMemo(
    () => {
      const result = [
        ...customStyleImagesChoices];
      if (defaultSprites.length > 0) {
        result.push({
          id: 'separator-native',
          name: translate('style-editor.icon.icon-image-native'),
          disabled: true,
        });
        result.push(...defaultSprites);
      }
      return result;
    },
    [translate, customStyleImagesChoices, defaultSprites],
  );

  return iconChoices;
}

export default useStyleImagesOptions;
