type MediaYear = number | [number, number | undefined];
interface MediaMetadata {
  durationInMS?: number;
}

interface Media {
  title: string;
  synopsis?: string;
  cast?: string[];
  year?: MediaYear;
  imdbLink?: string;
}

export type Movie = Media & MediaMetadata;

export interface TVShow extends Media {
  episode: Episode;
}

interface Episode extends MediaMetadata {
  number: number;
  season: number;
}

export interface Subtitle {
  id: string;
  title: string;
  provider: string;
  language: string;
  source: string; // link to download the subtitle
  media?: Media;
  file?: NodeJS.ReadableStream;
  releases?: string[];
  uploader?: string;
  releasedAt?: Date;
  downloads?: number;
}
import type { ElementHandle } from 'puppeteer';

export interface SearchFilter {
  keyword: string;
  movie?: boolean;
  tvShow?: boolean;
}

export interface Provider<T> {
  search(filter: SearchFilter): Promise<T>;
}

export interface Authenticator {
  authenticate(): Promise<boolean>;
}

export interface Scraper<T> {
  (handle: ElementHandle): Promise<T>;
}
