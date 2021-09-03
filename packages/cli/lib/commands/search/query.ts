import { factory, Subtitle } from '@subtitles/providers';
import chalk from 'chalk';
import config from 'config';
import createDebugger from 'debug';

const debug = createDebugger('cli:search');

function formatSubtitle({
  id,
  title,
  releases,
  releasedAt,
  source,
  language,
  downloads,
  provider,
}: Subtitle): void {
  console.info(
    `
(%s) %s
    %s
    Releases: %s
    %s downloads / %s / %s
    %s\n
    `,
    id,
    chalk.green.bold(title),
    chalk.yellow(releasedAt?.toLocaleString() ?? 'No Date'),
    releases?.join('\n\t') ?? 'No release. check the title',
    chalk.red.bold(downloads ?? '?'),
    chalk.red.bold(language),
    chalk.blue.underline(provider),
    chalk.blue.underline(source)
  );
}

export default async function query(keyword: string[]): Promise<void> {
  console.time('query');

  debug('keyword %o', keyword);

  const {
    credentials: { opensubtitles: os },
  } = config;

  let opensubtitles: { username: string; password: string } | undefined;

  if (os.username && os.password) {
    const { username, password } = os;
    opensubtitles = { username, password };
  }

  try {
    const providers = await factory({ opensubtitles });

    const results = await Promise.allSettled(
      providers.map(async provider =>
        provider.search({ keyword: keyword.join(' ') })
      )
    );

    const subtitles: Subtitle[] = results.reduce(
      (subtitles: Subtitle[], providerResult) => {
        if (providerResult.status === 'rejected') {
          debug(`Error searching provider\n%O`, providerResult.reason);
          return subtitles;
        } else {
          debug(`search sucessfuly:\n%O`, providerResult.value);
          return subtitles.concat(providerResult.value);
        }
      },
      []
    );

    for (const subtitle of subtitles) {
      formatSubtitle(subtitle);
    }
    console.info('found %d subtitles', subtitles.length);
  } catch (error) {
    console.error(`couldn't query legendas.tv provider\n%o`, error);
  }

  console.timeEnd('query');
}
