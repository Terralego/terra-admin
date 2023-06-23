import React from 'react';
import { useFormState } from 'react-final-form';

const useCustomStyleImages = () => {
  const { values: { style_images: styleImages } = {} } = useFormState();

  const customImages = React.useMemo(
    () => styleImages
      ?.filter(({ name, slug, file } = {}) => Boolean(name && slug && file)),
    [styleImages],
  );

  return customImages || [];
};

export default useCustomStyleImages;
