import type { OptionValues } from 'commander';
import { LegendasTvProvider } from 'providers';

// usar o imdb para realizar a busca?!
// e após encontrar no imdb eu faço a busca no provedor correto
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
    const provider = new LegendasTvProvider();
    const subtitles = await provider.search({ keyword: keyword.join(' ') });
    console.log(subtitles);
  } catch (error) {
    console.error(`couldn't query legendas.tv provider\n%o`, error);
  }

  console.timeEnd('query');
}
