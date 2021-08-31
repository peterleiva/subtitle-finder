export interface Subtitle {
  id: string;
  release: string;
  downloads?: number;
  uploader?: string;
  releasedAt?: Date;
  source?: string; // html page where link is
  fileUrl: string; // director link to download the subtitle
  language: string;
  provider: string;
}
