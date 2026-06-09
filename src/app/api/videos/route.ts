import { NextResponse } from "next/server";
import { listVideos, createVideo } from "@/lib/actions/videos";

export async function GET() {
  try {
    const videos = await listVideos();
    return NextResponse.json(videos);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list videos";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title: string;
      fileUrl: string;
      fileName: string;
      mimeType: string;
      size: number;
      duration?: number | null;
      fps?: number;
    };

    const video = await createVideo(body);
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create video";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
