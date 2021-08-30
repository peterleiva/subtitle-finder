import { URL } from 'url';
import { Browser, launch } from 'puppeteer';
import { Provider, SearchFilter } from 'providers';
import { Subtitle } from 'types';
import scraper from './scraper';
import flatCache from 'flat-cache';
import { Scraper } from 'providers/types';

const BASE_URL = 'http://legendas.tv';
const SEARCH_PATH = '/busca';
const CACHE_PATH = '/tmp/subtitle-finder/cache';

export default class LegendasTvProvider implements Provider<Subtitle[]> {
  #scraper: Scraper<Subtitle>;

  constructor() {
    this.#scraper = scraper();
  }

  async search({ keyword }: SearchFilter): Promise<Subtitle[]> {
    const cache = flatCache.load('legendas.tv-query', CACHE_PATH);

    let subtitles: Subtitle[] | undefined = cache.getKey(keyword);

    if (subtitles) {
      console.info(`Found subtitles in cache`);
      return subtitles;
    }

    const url = new URL(SEARCH_PATH + '/' + keyword, BASE_URL);
    let browser: Browser | null = null;

    try {
      browser = await launch();

      const page = await browser.newPage();
      await page.goto('' + url);

      const handlers = await page.$$(
        '#resultado_busca > .list_element > article > div'
      );

      if (handlers.length === 0) {
        console.info(`No results found`);
        await browser.close();
        return [];
      }

      const scrapers = handlers.map(this.#scraper);

      subtitles = await Promise.all(scrapers);

      cache.setKey(keyword, subtitles);
      cache.save();
    } finally {
      await browser?.close();
    }

    return subtitles;
  }
}
