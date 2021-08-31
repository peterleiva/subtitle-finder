export interface Subtitle {
  id: string;
  release: string;
  downloads?: string;
  uploader?: string;
  releasedAt?: Date;
  source?: string; // html page where link is
  fileUrl: string; // director link to download the subtitle
  language: string;
}
