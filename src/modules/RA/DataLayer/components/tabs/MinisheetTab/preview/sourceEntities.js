import Api from '../../../../../../../terra-front/Api';

/** Entity of the source as the preview uses it, without what the search adds. */
export const toEntity = ({ identifier, properties = {} }) => {
  const { search_match: searchMatch, ...rest } = properties;
  return { identifier, properties: rest };
};

/** Label of an entity in the picker: the field of the minisheet title, else its identifier. */
export const entityLabel = (entity, titleField) => {
  const value = titleField && entity.properties[titleField];
  return value === undefined || value === null || value === '' ? `${entity.identifier}` : `${value}`;
};

/**
 * Entities of the source, by its slug, as the search of the front reads them;
 * the first ones with no search.
 */
export const fetchEntities = async (slug, { search, limit = 10 } = {}) => {
  const { results = [] } = await Api.request(`geo-api/${encodeURIComponent(slug)}/feature/`, {
    querystring: { ...(search ? { search } : {}), limit },
  }) || {};
  return results.map(toEntity);
};
