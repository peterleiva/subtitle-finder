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
  file?: ReadableStream;
  releases?: string[];
  uploader?: string;
  releasedAt?: Date;
  downloads?: number;
}
