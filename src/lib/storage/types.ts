export type SaveVideoInput = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
};

export type StoredVideoFile = {
  /** Public or signed URL used by the video player */
  fileUrl: string;
  /** Original upload filename for display */
  fileName: string;
  mimeType: string;
  size: number;
  /** Provider-specific object key/path for future delete/replace */
  storageKey: string;
  duration: number | null;
};

export interface VideoStorageProvider {
  saveVideo(input: SaveVideoInput): Promise<StoredVideoFile>;
}
