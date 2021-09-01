export type SubtitleType = 'movie' | 'tv show';

export interface Subtitle {
  id: string;
  title: string;
  releases?: string[];
  downloads?: number;
  uploader?: string;
  releasedAt?: Date;
  source?: string; // html page where link is
  fileUrl: string; // director link to download the subtitle
  language: string;
  provider: string;
  type?: SubtitleType;
  synopsis?: string;
}
