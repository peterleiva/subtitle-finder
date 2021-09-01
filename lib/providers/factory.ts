import {
  OpenSubtitleProvider,
  CacheProvider,
  LegendasTvProvider,
  LegendeiProvider,
  Provider,
} from 'providers';
import type { Subtitle } from 'types';
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

export default function factory(): Provider<Subtitle[]>[] {
  return [
    new CacheProvider(
      { namespace: 'legendas-tv' },
      new LegendasTvProvider(),
      deserializer
    ),
    new CacheProvider(
      { namespace: 'opensubtitle' },
      new OpenSubtitleProvider(),
      deserializer
    ),
    new CacheProvider(
      { namespace: 'legendei' },
      new LegendeiProvider(),
      deserializer
    ),
  ];
}
