import { Provider, SearchFilter } from '../types';
import { Subtitle } from '../types';
import config from '../config';
import { createHash } from 'crypto';
import createDebug from 'debug';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import OS from 'opensubtitles-api';

const debug = createDebug('provider:opensubtitles');

function scraper(subtitle: { [key: string]: string }): Subtitle {
  const { lang, url, downloads, id, filename, date } = subtitle;

  return {
    id,
    title: filename,
    releasedAt: new Date(date),
    source: url,
    language: lang,
    downloads: +downloads,
    provider: 'opensubtitles.org',
  };
}

export default class OpenSubtitleProvider implements Provider<Subtitle[]> {
  #os;
  #hasher;

  constructor() {
    this.#hasher = createHash('md5');

    const username = config.openSubtitle.username;
    const password = config.openSubtitle.password;

    this.#os = new OS({
      username,
      password,
      useragent: 'UserAgent',
      ssl: true,
    });
  }

  async search({ keyword }: SearchFilter): Promise<Subtitle[]> {
    try {
      await this.#os.login();
    } catch (error) {
      console.error("can't login in OpenSubtitle");
      throw error;
    }

    console.info('successfully logged in opensubtitles');

    const osSubtitles = await this.#os.search({
      sublanguageid: ['pob'].join(),
      query: keyword,
      tag: keyword,
      gzip: true,
      limit: 10,
    });

    const subtitles: Subtitle[] = [];

    for (const language in osSubtitles) {
      const langResults = osSubtitles[language];

      debug('found subtitle in %s language - %O', language, langResults);

      if (Array.isArray(langResults)) {
        console.info(`found multiple subtitles for language "${language}"`);
        subtitles.push(...langResults.map(scraper));
      } else {
        console.info(`found a single language for "${language}"`);
        subtitles.push(scraper(langResults));
      }
    }

    return subtitles;
  }
}
