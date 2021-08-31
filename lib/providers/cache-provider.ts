import { Provider, SearchFilter } from './types';
import { createHash } from 'crypto';
import flatCache from 'flat-cache';

export default class CacheProvider<T> {
  private static CACHE_PATH = '/tmp/subtitle-finder/cache/';
  #hasher;
  #provider;
  #cache;

  constructor(cache: { namespace: string }, provider: Provider<T>) {
    this.#hasher = createHash('md5');
    this.#provider = provider;
    this.#cache = cache;
  }

  async search(filter: SearchFilter): Promise<T> {
    const file = this.#hasher.update(filter.keyword).digest('hex');
    const cache = flatCache.load(
      file,
      CacheProvider.CACHE_PATH + '/' + this.#cache.namespace
    );

    const cachedResult = cache.getKey('keyword');

    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.#provider.search(filter);

    cache.setKey('keyword', result);
    cache.save();

    return result;
  }
}
