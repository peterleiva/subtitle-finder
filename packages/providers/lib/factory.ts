import {
  OpenSubtitleProvider,
  CacheProvider,
  LegendasTvProvider,
  LegendeiProvider,
  Provider,
} from '.';
import type { Subtitle } from './types';
import { Deserializer } from './cache-provider';

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

function createOpenSubtitle({ username, password }: PasswordMechanism) {
  return new OpenSubtitleProvider(username, password);
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

export default function factory({
  opensubtitles,
}: FactoryOptions): Provider<Subtitle[]>[] {
  const providers = [];

  if (opensubtitles)
    providers.push(
      createCache('opensubtitle', createOpenSubtitle(opensubtitles))
    );

  return [
    createCache('legendas-tv', new LegendasTvProvider()),
    createCache('legendei', new LegendeiProvider()),
  ];
}
