import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  ALLOWED_VIDEO_MIME_PREFIX,
  MAX_VIDEO_FILE_SIZE,
} from "@/lib/storage/constants";
import { getVideoStorage } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith(ALLOWED_VIDEO_MIME_PREFIX)) {
      return NextResponse.json(
        { error: "Only video files are allowed" },
        { status: 400 },
      );
    }

    if (file.size > MAX_VIDEO_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 500 MB limit" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getVideoStorage();
    const stored = await storage.saveVideo({
      buffer,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    });

    return NextResponse.json({
      fileUrl: stored.fileUrl,
      fileName: stored.fileName,
      mimeType: stored.mimeType,
      size: stored.size,
      storageKey: stored.storageKey,
      duration: stored.duration,
    });
  } catch (error) {
    console.error("Upload error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
