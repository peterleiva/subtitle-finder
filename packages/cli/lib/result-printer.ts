import type { Subtitle } from '@subtitles/providers';

export interface ResultPrinter {
  (subtitle: Subtitle): string;
}
