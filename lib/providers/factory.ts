import {
  OpenSubtitleProvider,
  CacheProvider,
  LegendasTvProvider,
  Provider,
} from 'providers';
import type { Subtitle } from 'types';
import { Deserializer } from './cache-provider';

const deserializer: Deserializer<Subtitle[]> = (
  raw: { [key: string]: string }[]
): Subtitle[] => {
  return raw.map(
    ({
      id,
      release,
      downloads,
      uploader,
      releasedAt,
      source,
      fileUrl,
      language,
      provider,
    }) => ({
      id,
      release,
      downloads: +downloads,
      uploader,
      releasedAt: releasedAt ? new Date(releasedAt as string) : undefined,
      source,
      fileUrl,
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
  ];
}
