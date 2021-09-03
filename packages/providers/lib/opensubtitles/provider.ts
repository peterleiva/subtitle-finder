import { Provider, SearchFilter } from '../types';
import { Subtitle } from '../types';
import createDebug from 'debug';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import OS from 'opensubtitles-api';

const debug = createDebug('providers:opensubtitles');

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
  #os: OS;

  async authenticate(username: string, password: string): Promise<boolean> {
    debug('logging to OpenSubtitles');
    this.#os = new OS({
      username,
      password,
      useragent: 'UserAgent',
      ssl: true,
    });

    try {
      await this.#os.login();
      debug('successfully logged in');

      return true;
    } catch (error) {
      debug('failed to trying to login');
      this.#os = null;
      throw error;
    }
  }

  async search({ keyword }: SearchFilter): Promise<Subtitle[]> {
    const subtitles: Subtitle[] = [];

    if (!this.#os) return subtitles;

    const results = await this.#os.search({
      sublanguageid: ['pob'].join(),
      query: keyword,
      gzip: true,
      limit: 10,
    });

    for (const language in results) {
      const langResults = results[language];
      debug('found language %s', language);
      debug('found subtitle(s) %O', langResults);

      if (Array.isArray(langResults)) {
        subtitles.push(...langResults.map(scraper));
      } else {
        subtitles.push(scraper(langResults));
      }
    }

    return subtitles;
  }
}
