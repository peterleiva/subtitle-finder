import { factory } from 'providers';
import { Subtitle } from 'types';
import chalk from 'chalk';

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
    chalk.red.bold((downloads && !isNaN(downloads)) || '?'),
    chalk.red.bold(language),
    chalk.blue.underline(provider),
    chalk.blue.underline(source)
  );
}

export default async function query(keyword: string[]): Promise<void> {
  console.time('query');

  try {
    const providers = factory();

    const results = await Promise.allSettled(
      providers.map(async provider =>
        provider.search({ keyword: keyword.join(' ') })
      )
    );

    const subtitles: Subtitle[] = results.reduce(
      (subtitles: Subtitle[], providerResult) => {
        if (providerResult.status === 'rejected') {
          console.info(`Error searching provider\n%o`, providerResult.reason);
          return subtitles;
        } else {
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
