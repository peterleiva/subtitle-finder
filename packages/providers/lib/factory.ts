import {
  OpenSubtitleProvider,
  CacheProvider,
  LegendasTvProvider,
  LegendeiProvider,
  Provider,
} from '.';
import type { Subtitle } from './types';
import { Deserializer } from './cache-provider';
import createDebugger from 'debug';

const debug = createDebugger('providers:factory');

const deserializer: Deserializer<Subtitle[]> = (
  raw: { [key: string]: any }[]
): Subtitle[] => {
  return raw.map(
    ({
      id,
      title,
      releases,
      downloads,
      uploader,
      releasedAt,
      source,
      language,
      provider,
    }) => ({
      id,
      title,
      releases,
      downloads: +downloads,
      uploader,
      releasedAt: releasedAt ? new Date(releasedAt as string) : undefined,
      source,
      language,
      provider,
    })
  );
};

async function buildOpenSubtitle({ username, password }: PasswordMechanism) {
  const provider = new OpenSubtitleProvider(username, password);

  await provider.authenticate();

  return provider;
}

function createCache(
  namespace: string,
  provider: Provider<Subtitle[]>
): CacheProvider<Subtitle[]> {
  return new CacheProvider({ namespace }, provider, deserializer);
}

type PasswordMechanism = {
  username: string;
  password: string;
};

type FactoryOptions = Partial<{
  opensubtitles: PasswordMechanism;
}>;

export default async function factory({
  opensubtitles,
}: FactoryOptions): Promise<Provider<Subtitle[]>[]> {
  const providers = [];
  if (opensubtitles)
    try {
      providers.push(
        createCache('opensubtitle', await buildOpenSubtitle(opensubtitles))
      );
    } catch (error) {
      debug('error trying building opensubtitles provider\n%O', error);
    }

  return providers.concat([
    createCache('legendas-tv', new LegendasTvProvider()),
    createCache('legendei', new LegendeiProvider()),
  ]);
}
