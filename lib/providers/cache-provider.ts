import { Provider, SearchFilter } from './types';
import { createHash } from 'crypto';
import flatCache from 'flat-cache';

export interface Deserializer<T> {
  (rawObject: any): T;
}

export default class CacheProvider<T> {
  private static CACHE_PATH = '/tmp/subtitle-finder/cache/';
  #hasher;
  #provider;
  #cache: { namespace: string };
  #deserializer;

  constructor(
    cache: { namespace: string },
    provider: Provider<T>,
    deserializer?: Deserializer<T>
  ) {
    this.#hasher = createHash('md5');
    this.#provider = provider;
    this.#cache = Object.defineProperty(cache, 'namespace', {
      value: cache.namespace,
      writable: false,
    });
    this.#deserializer = deserializer;
  }

  async search(filter: SearchFilter): Promise<T> {
    const file = this.#hasher.update(filter.keyword).digest('hex');
    const cache = flatCache.load(
      file,
      CacheProvider.CACHE_PATH + '/' + this.#cache.namespace
    );

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
