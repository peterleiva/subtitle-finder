import type { ElementHandle } from 'puppeteer';

export interface SearchFilter {
  keyword: string;
  movie?: boolean;
  tvShow?: boolean;
}

export interface Provider<T> {
  search(filter: SearchFilter): Promise<T>;
}

export interface Scraper<T> {
  (handle: ElementHandle): Promise<T>;
}
