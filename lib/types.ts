export interface Subtitle {
  id: string;
  release: string;
  downloads?: string;
  uploader?: string;
  releasedAt?: Date;
  source: string; // page where subtitle lives
  fileUrl: string; // director link to download the subtitle
}
