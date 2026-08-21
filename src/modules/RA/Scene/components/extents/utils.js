
export const SINGLE = 'single';
export const MULTIPLE = 'multiple';

export const isValidBbox = bbox =>
  Array.isArray(bbox) && bbox.length === 4 && bbox.every(Number.isFinite);

export const isSameBbox = (a, b) => {
  if (!isValidBbox(a) || !isValidBbox(b)) return !isValidBbox(a) && !isValidBbox(b);
  return a.every((value, index) => value === b[index]);
};

export const getExtentType = ({ extent_type: extentType } = {}) =>
  (extentType === MULTIPLE ? MULTIPLE : SINGLE);

export const getFitBoundsBbox = ({ fitBounds } = {}) => {
  const { coordinates } = fitBounds || {};
  return isValidBbox(coordinates) ? coordinates : [];
};

export const toFitBounds = bbox => (isValidBbox(bbox) ? { coordinates: bbox } : {});

export const EXTENTS_PATH = 'extra_extents';
export const normalizeExtents = extents =>
  (Array.isArray(extents)
    ? extents.filter(id => ['string', 'number'].includes(typeof id))
    : []);

export const validateExtraExtents = (extents, values = {}) => {
  const { config: { map_settings: mapSettings } = {} } = values || {};
  if (getExtentType(mapSettings) !== MULTIPLE) return undefined;

  return normalizeExtents(extents).length === 0
    ? 'view.form.extent.error-empty'
    : undefined;
};

export const getCategory = ({ category } = {}) => {
  if (category && typeof category === 'object') return category.name || category.label || '';
  return typeof category === 'string' ? category : '';
};

export const groupByCategory = (catalogue = []) => {
  const groups = [];

  catalogue.forEach(extent => {
    const category = getCategory(extent);
    const found = groups.find(group => group.category === category);
    if (found) found.extents.push(extent);
    else groups.push({ category, extents: [extent] });
  });

  return groups.sort((a, b) => Number(!a.category) - Number(!b.category));
};

export const moveExtent = (extents, from, to) => {
  if (to < 0 || to >= extents.length) return extents;
  const next = [...extents];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
};
