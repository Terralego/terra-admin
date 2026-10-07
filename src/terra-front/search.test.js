import { Search, buildQuery, postMsearch } from './search';

const HOST = 'http://localhost/elasticsearch';

const respond = (body, { ok = true, status = 200, statusText = 'OK' } = {}) =>
  Promise.resolve({ ok, status, statusText, json: () => Promise.resolve(body) });

beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  delete global.fetch;
});

describe('postMsearch', () => {
  it('posts the lines as NDJSON with a trailing newline', async () => {
    global.fetch.mockReturnValue(respond({ responses: [] }));

    await postMsearch(`${HOST}/`, [{ index: 'a' }, { size: 0 }]);

    expect(global.fetch).toHaveBeenCalledWith(`${HOST}/_msearch`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-ndjson' },
      body:    '{"index":"a"}\n{"size":0}\n',
    });
  });

  it('returns the raw response body', async () => {
    const body = { responses: [{ hits: { total: { value: 3 } } }] };
    global.fetch.mockReturnValue(respond(body));

    await expect(postMsearch(HOST, [])).resolves.toEqual(body);
  });

  it('throws on an HTTP error, which fetch alone does not', async () => {
    global.fetch.mockReturnValue(respond({}, { ok: false, status: 400, statusText: 'Bad Request' }));

    await expect(postMsearch(HOST, [])).rejects.toThrow('400 Bad Request');
  });
});

describe('Search', () => {
  it('sends a multi-search with one header and one query per search', async () => {
    const responses = [{ hits: { total: { value: 7 } } }];
    global.fetch.mockReturnValue(respond({ responses }));
    const search = new Search(HOST);

    const result = await search.msearch([{ index: 'source', include: [], size: 0 }]);

    expect(result).toEqual({ responses });
    const [[url, { body }]] = global.fetch.mock.calls;
    expect(url).toBe(`${HOST}/_msearch`);
    expect(body.split('\n')).toEqual([
      '{"index":"source"}',
      JSON.stringify(buildQuery({ include: [], size: 0 })),
      '',
    ]);
  });

  it('batches single searches and resolves each with its own response', async () => {
    global.fetch.mockReturnValue(respond({ responses: [{ id: 1 }, { id: 2 }] }));
    const search = new Search(HOST);

    const results = await Promise.all([
      search.search({ index: 'a', size: 0 }),
      search.search({ index: 'b', size: 0 }),
    ]);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
  });
});

describe('buildQuery', () => {
  it('drops the source when no field is included, as counts need', () => {
    expect(buildQuery({ include: [], size: 0 })).toEqual({
      size:              0,
      track_total_hits:  true,
      _source:           false,
    });
  });
});
