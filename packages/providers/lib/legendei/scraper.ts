import puppeteer from 'puppeteer';
import type { Browser, ConsoleMessage, Page } from 'puppeteer';
import type { URL } from 'url';
import createDebugger from 'debug';
import chalk from 'chalk';
import { Subtitle } from '../types';
import config from '../config';

const debug = createDebugger('providers:legendei.to:scraper');
const pageConsole = createDebugger('providers:legendei.to:scraper:console');

export default async function scraper(url: URL): Promise<Subtitle | null> {
  const pageConsoleListener = (msg: ConsoleMessage) => {
    ['log', 'info', 'error'].some(level => level === msg.type()) &&
      pageConsole('scraper log (%s): %s', chalk.blue(url.pathname), msg.text());
  };

  debug('scraping page %s', url);

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    browser = await puppeteer.launch({ headless: config.headless });
    page = await browser.newPage();
    page.on('console', pageConsoleListener);

    await page.goto('' + url);
    debug('sucessfully open page %s. Ready crawling', url);

    const downloads = await (
      await page.$('.download-count')
    )?.evaluate(node => {
      const result = node.innerHTML.match(/^(\d+)/);
      let downloads;
      if ((downloads = result?.[1])) {
        return +downloads;
      }
    });

    const title = await (
      await page.$('h1.post-title.entry-title > a')
    )?.evaluate(node => node.innerHTML);

    const source = await (
      await page.$('.entry-content a[href].buttondown')
    )?.evaluate(anchor => (anchor as HTMLAnchorElement).href);

    const releases = await (
      await page.$('.entry-content > p:nth-of-type(3)')
    )?.evaluate(node => {
      const releases = [];

      for (const content of Array.from(node.childNodes)) {
        if (content.nodeType === Node.TEXT_NODE && content.textContent) {
          releases.push(content.textContent.replace('\n', ''));
        }
      }

      return releases;
    });

    let releasedAt: Date | undefined;

    await (
      await page.$('.simple-grid-entry-meta-single-date')
    )?.evaluate(node => {
      const dateIndex: { [k: string]: number } = {
        janeiro: 0,
        fevereiro: 1,
        março: 2,
        abril: 3,
        maio: 4,
        junho: 5,
        julho: 6,
        agosto: 7,
        setembro: 8,
        outubro: 9,
        novembro: 10,
        dezembro: 11,
      };

      const rawDate = node.lastChild?.textContent?.trim();

      const match = rawDate?.match(/(\d+) de (\w+) de (\d+)/i);

      if (match) {
        const [, day, month, year] = match;

        if (!(day && month && year)) return;

        return new Date(+year, dateIndex[month], +day, 0, 0).toISOString();
      }
    });

    if (!(title && source)) {
      throw new Error(`Couldn't scrap title or url to download subtitle`);
    }

    const subtitle = {
      id: title,
      title,
      downloads,
      source,
      releasedAt,
      releases,
      language: 'Português Brasileiro',
      provider: 'legendei.to',
    };

    debug('subtitle found: %O', subtitle);
    return subtitle;
  } finally {
    !browser && debug("can't launch browser at %s ", url);

    page?.removeAllListeners();
    await browser?.close();
  }
}
