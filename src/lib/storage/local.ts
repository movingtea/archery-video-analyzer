import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import {
  ALLOWED_VIDEO_MIME_PREFIX,
  MAX_VIDEO_FILE_SIZE,
} from "./constants";
import type { SaveVideoInput, StoredVideoFile, VideoStorageProvider } from "./types";

/**
 * MVP local filesystem storage.
 *
 * Files are written to `public/uploads/` and served as static assets.
 * Suitable for local development only — not for production:
 * - no CDN, no durability guarantees, no multi-instance support
 * - server disk fills up quickly with large videos
 *
 * Replace with S3 / R2 / Supabase Storage by implementing `VideoStorageProvider`
 * and switching `getVideoStorage()` in `./index.ts`.
 */
export class LocalVideoStorage implements VideoStorageProvider {
  private uploadsDir = path.join(process.cwd(), "public", "uploads");

  async saveVideo(input: SaveVideoInput): Promise<StoredVideoFile> {
    if (!input.mimeType.startsWith(ALLOWED_VIDEO_MIME_PREFIX)) {
      throw new Error("Only video files are allowed");
    }

    if (input.size > MAX_VIDEO_FILE_SIZE) {
      throw new Error("File exceeds 500 MB limit");
    }

    await mkdir(this.uploadsDir, { recursive: true });

    const extension = path.extname(input.originalName) || ".mp4";
    const storageKey = `${randomUUID()}${extension}`;
    const absolutePath = path.join(this.uploadsDir, storageKey);

    await writeFile(absolutePath, input.buffer);

    return {
      fileUrl: `/uploads/${storageKey}`,
      fileName: input.originalName,
      mimeType: input.mimeType,
      size: input.size,
      storageKey,
      duration: null,
    };
  }
}
