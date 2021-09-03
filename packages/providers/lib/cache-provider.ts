import { createHash } from 'crypto';
import flatCache from 'flat-cache';
import { Provider, SearchFilter } from './types';
import createDebugger from 'debug';

const debug = createDebugger('providers:cache');
export interface Deserializer<T> {
  (rawObject: any): T;
}

export default class CacheProvider<T> implements Provider<T> {
  private static CACHE_PATH = '/tmp/subtitle-finder/cache/';
  #hash;
  #provider;
  #cache: { namespace: string };
  #deserializer;

  constructor(
    cache: { namespace: string },
    provider: Provider<T>,
    deserializer?: Deserializer<T>
  ) {
    this.#hash = createHash('md5');
    this.#provider = provider;
    this.#cache = Object.defineProperty(cache, 'namespace', {
      value: cache.namespace,
      writable: false,
    });
    this.#deserializer = deserializer;
  }

  async search(filter: SearchFilter): Promise<T> {
    const searchPath = CacheProvider.CACHE_PATH + this.#cache.namespace;

    const file = this.#hash.update(filter.keyword.toLowerCase()).digest('hex');
    const cache = flatCache.load(file + '.json', searchPath);

    debug('file %s for query', searchPath);

    const cachedResult = cache.getKey('keyword');

    if (cachedResult) {
      if (this.#deserializer) return this.#deserializer(cachedResult);
      return cachedResult;
    }

    const result = await this.#provider.search(filter);

    cache.setKey('keyword', result);
    cache.save();

    return result;
  }
}
