import { LocalVideoStorage } from "./local";
import type { VideoStorageProvider } from "./types";

export { MAX_VIDEO_FILE_SIZE, MAX_VIDEO_FILE_SIZE_LABEL } from "./constants";
export type { SaveVideoInput, StoredVideoFile, VideoStorageProvider } from "./types";

/**
 * Server-only video storage factory.
 * Client components must import limits from `./constants` instead.
 *
 * MVP: local filesystem (`public/uploads`).
 * Production: implement `VideoStorageProvider` for S3 / R2 / Supabase Storage
 * and select via `VIDEO_STORAGE_PROVIDER` env var.
 */
export function getVideoStorage(): VideoStorageProvider {
  const provider = process.env.VIDEO_STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return new LocalVideoStorage();
    // case "s3":
    //   return new S3VideoStorage();
    // case "r2":
    //   return new R2VideoStorage();
    // case "supabase":
    //   return new SupabaseVideoStorage();
    default:
      throw new Error(`Unsupported VIDEO_STORAGE_PROVIDER: ${provider}`);
  }
}
