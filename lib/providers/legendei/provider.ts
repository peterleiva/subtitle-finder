import { SearchFilter } from 'providers';
import { Browser, launch } from 'puppeteer';
import { Subtitle } from 'types';
import { URL } from 'url';
import scraper from './scraper';
import createDebugger from 'debug';
import config from 'config';

const debug = createDebugger('provider:legendei.to');

export default class LegendeiProvider {
  private static URL = 'http://legendei.to';

  async search({ keyword }: SearchFilter): Promise<Subtitle[]> {
    let subtitles: Subtitle[] = [];

    const url = new URL(
      '/?s=' + keyword.trim().split(' ').join('+'),
      LegendeiProvider.URL
    );

    console.info('searching in %s for %s keyword', url, keyword);
    let browser: Browser | null = null;

    try {
      browser = await launch({ headless: config.headless });
      const page = await browser.newPage();

      debug('starting opening page: %s', url);
      await page.goto('' + url, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });

      debug('sucessfully page open');

      const handlers = await page.$$(
        '#simple-grid-posts-wrapper .simple-grid-grid-post-inside'
      );

      if (!handlers) {
        debug('no results');
        console.info('no results for %s', LegendeiProvider.URL);
        return subtitles;
      }

      const urls = await Promise.all(
        handlers.map(async handler => {
          const subtitleHandler = await handler.$(
            'a[class="simple-grid-grid-post-thumbnail-link"]'
          );

          return await subtitleHandler?.evaluate(
            anchor => (anchor as HTMLAnchorElement).href
          );
        })
      );

      await browser.close();

      const operations = (urls.filter(Boolean) as string[]).map(async url =>
        scraper(new URL(url, LegendeiProvider.URL))
      );

      subtitles = (await Promise.all(operations)).filter(Boolean) as Subtitle[];
    } finally {
      !browser && debug("browser wasn't launched correctely");
      await browser?.close();
      debug('provider finishes search');
    }

    return subtitles;
  }
}
