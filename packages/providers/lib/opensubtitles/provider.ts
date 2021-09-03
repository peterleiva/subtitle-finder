import { Provider, SearchFilter, Subtitle, Authenticator } from '../types';
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

export default class OpenSubtitleProvider
  implements Provider<Subtitle[]>, Authenticator
{
  #os: OS;
  #authenticated: boolean;

  constructor(username: string, password: string) {
    this.#os = new OS({
      username,
      password,
      useragent: 'UserAgent',
      ssl: true,
    });

    this.#authenticated = false;
  }

  get authenticated(): boolean {
    return this.#authenticated;
  }

  async authenticate(): Promise<boolean> {
    debug('logging to OpenSubtitles');

    try {
      await this.#os.login();
      debug('successfully logged in');
      this.#authenticated = true;
      return true;
    } catch (error) {
      debug('failed to trying to login');
      this.#authenticated = false;
      throw error;
    }
  }

  async search({ keyword }: SearchFilter): Promise<Subtitle[]> {
    const subtitles: Subtitle[] = [];

    if (!this.authenticated) return subtitles;

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
