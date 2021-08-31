import {
  OpenSubtitleProvider,
  CacheProvider,
  LegendasTvProvider,
  Provider,
} from 'providers';
import type { Subtitle } from 'types';

export default function factory(): Provider<Subtitle[]>[] {
  return [
    new CacheProvider({ namespace: 'legendas-tv' }, new LegendasTvProvider()),
    new CacheProvider(
      { namespace: 'opensubtitle' },
      new OpenSubtitleProvider()
    ),
  ];
}
