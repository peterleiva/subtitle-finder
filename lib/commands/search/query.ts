import type { OptionValues } from 'commander';
import { factory } from 'providers';
import { Subtitle } from 'types';
import chalk from 'chalk';

function formatSubtitle({
  id,
  release,
  releasedAt,
  fileUrl,
  language,
  downloads,
  provider,
}: Subtitle): void {
  console.info(
    '(%s) %s\n\t%s\n\t%s downloads / %s / %s\n\t%s\n\n',
    id,
    chalk.green.bold(release),
    chalk.yellow('' + releasedAt),
    chalk.red.bold(downloads ?? '?'),
    chalk.red.bold(language),
    chalk.blue.underline(provider),
    chalk.blue.underline(fileUrl)
  );
}

export default async function query(
  keyword: string[],
  { verbose }: OptionValues
): Promise<void> {
  // cria o provider
  // listar resultado:
  //  ano do produto (opcional)
  //  temporada e episódio (se for TV)
  //  sinopse (caso exista)
  //  link para o imdb
  //
  // fazer a busca em 2 estágios?!
  // primeiro no imdb/openmovies (ou outro parecido) e depois no proveder
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
