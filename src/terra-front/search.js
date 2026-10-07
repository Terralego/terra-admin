import bodybuilder from 'bodybuilder';
import debounce from 'lodash.debounce';

export const MAX_SIZE = 10000;
export const SEARCHES_QUEUE = new Set();

/**
 * Build an Elastic Search query
 * @param {String} [query] A literal query
 * @param {Array} [boundingBox] Boundingbox to restrict results
 * @param {Number} [size=MAX_SIZE] Max number of results to fetch
 * @param {{}} [properties] Object representing properties.
 *   Each property should be a key/value association. Value may be a single
 *   value or an object describing the value and type
 * @param {String[]} [include] List of fields to include in results hits
 * @param {String[]} [exclude] List of fields to exclude in results hits.
 * @param {Object[]} [aggregations] Array of aggregations definition.
 *   Each aggregation will take a type, a field, a name and options.
 *    See https://bodybuilder.js.org/docs/#aggregation
 * @param {{}} [baseQuery] base query to start over.
 * @param {{}} [hookQuery] Allow to access bodybuild before the end.
 */
export const buildQuery = ({
  query = '',
  boundingBox,
  size = MAX_SIZE,
  properties/* = { propName: value }, { propName: { value, type: 'term'} } */,
  include,
  exclude,
  aggregations/* = [{ type, field, name, options }] */,
  baseQuery = {},
  hookQuery = () => {},
}) => {
  const body = bodybuilder();

  if (baseQuery?.query?.bool?.filter) {
    // Add filter clauses from base query
    Object.entries(baseQuery.query.bool.filter).forEach(([key, value]) => {
      body.filter(key, value);
    });
  }

  body.size(size);
  body.rawOption('track_total_hits', true); // Will not be supported in version 8 of ES.
  if (query) {
    body.query('query_string', 'query', query.split(/\s+/).map(subquery => `*${subquery}*`).join(' AND '));
  }

  if (properties) {
    Object.keys(properties).forEach(property => {
      const rawValue = properties[property];
      const { value, type = 'match' } = (typeof rawValue === 'object' && !Array.isArray(rawValue))
        ? rawValue
        : { value: rawValue };
      if (value) {
        if (typeof value.min === 'number' && typeof value.max === 'number') {
          const { min, max } = value;
          body.filter('range', property, { gte: +min, lte: +max });
        } else if (Array.isArray(value)) {
          body.filter('bool', q => q
            .orFilter('terms', property, value));
        } else {
          const values = [value];
          values.forEach(val => {
            if (type === 'match' && typeof val === 'string') {
              body.filter('bool', q => q
                .orFilter(type, property, val)
                .orFilter('wildcard', property, `*${val}*`));
            } else {
              body.filter(type, property, val);
            }
          });
        }
      }
    });
  }

  if (boundingBox) {
    body.filter('geo_shape', 'geom', {
      shape: {
        type: 'envelope',
        coordinates: boundingBox,
      },
    });
  }

  if (aggregations) {
    aggregations.forEach(({ type = 'terms', field, options, name }) =>
      body.aggregation(type, field, options, name));
  }

  // Apply query hooks if any
  hookQuery(body);

  const bodyBuild = body.build();

  if (include || exclude) {
    const sourceAttr = '_source';
    bodyBuild[sourceAttr] = {};
    if ((include && !include.length)) {
      bodyBuild[sourceAttr] = false;
    } else {
      if (include) {
        bodyBuild[sourceAttr].includes = include;
      }
      if (exclude) {
        bodyBuild[sourceAttr].excludes = exclude;
      }
    }
  }

  return bodyBuild;
};

/**
 * POST `_msearch` : une ligne JSON par en-tête et par requête, en NDJSON, avec
 * un saut de ligne final que Elasticsearch exige.
 *
 * Remplace le client `elasticsearch`, dont la réponse brute avait la même forme.
 * Contrairement à lui, fetch ne lève pas sur une erreur HTTP : on le fait ici.
 */
export const postMsearch = async (host, lines) => {
  const response = await fetch(`${(host || '').replace(/\/$/, '')}/_msearch`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-ndjson' },
    body:    `${lines.map(line => JSON.stringify(line)).join('\n')}\n`,
  });

  if (!response.ok) {
    throw new Error(`Elasticsearch responded with ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export class Search {
  constructor (host) {
    this.host = host;
  }

  /**
   * Perform a single search
   *
   * For performance purposes, this search is added to a queue, which is sent
   * as multi-search (msearch).
   *
   * @param {String} query
   * @see buildQuery()
   * @param {String} [query.index] The ES index to search on
   * @return {Promise<unknown>}
   */
  async search (query = {/*
    query = '',
    boundingBox,
    properties,
    include,
    size = MAX_SIZE,
    index = DEFAULT_INDEX,
  */}) {
    const body = buildQuery(query);
    const { index } = query;
    const action = {
      body,
    };
    if (index) {
      action.header = { index };
    }
    const promise = new Promise(resolve => {
      action.resolve = resolve;
    });

    SEARCHES_QUEUE.add(action);
    this.batchSearch();
    return promise;
  }

  /**
   * Perform a multi-search
   *
   * @see search()
   *
   * @param queries
   */
  async msearch (queries = [/* {
      query: String,q
      include: String,
      properties: {
        property: String,
        //…
      }
    } */]) {
    if (!queries.length) throw new Error('`queries` must not be empty');

    const defaultSize = MAX_SIZE / queries.length;
    const searches = queries
      .map(
        ({ size = defaultSize, index, ...query }) =>
          [{ index }, buildQuery({ size, ...query })],
      )
      .reduce((body, [header, query]) => [...body, header, query],
        []);
    return postMsearch(this.host, searches);
  }

  /**
   * Consume SEARCHES_QUEUE as a batch of queries and send them as msearch.
   */
  batchSearch = debounce(async () => {
    // Consume the queue and reduce it to headers, bodies and resolvers
    const [headers, bodies, resolves] = Array
      .from(SEARCHES_QUEUE.values())
      .reduce(
        ([allHeaders, allBodies, allResolves], { header = {}, body, resolve }) =>
          [[...allHeaders, header], [...allBodies, body], [...allResolves, resolve]],
        [[], [], []],
      );

    // Reduce headers and bodies to a single body to be sent through ES client
    const batchBody = bodies
      .map((body, index) => ([headers[index], body]))
      .reduce((body, [header, query]) => [...body, header, query], []);
    SEARCHES_QUEUE.clear();

    // Perform the request and run all responses through the corresponding resolver
    const { responses } = await postMsearch(this.host, batchBody);
    resolves.forEach((resolve, index) => resolve(responses[index]));
  }, 500)
}

export default new Search();
