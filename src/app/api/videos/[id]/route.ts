import { NextResponse } from "next/server";
import { getVideoById, updateVideoMetadata } from "@/lib/actions/videos";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const video = await getVideoById(id);
    return NextResponse.json(video);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get video";
    const status =
      message === "Unauthorized" ? 401 : message === "Video not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      fps?: number;
      duration?: number | null;
      status?: "PENDING" | "READY" | "ANALYZING" | "DONE" | "FAILED";
      title?: string;
    };

    const video = await updateVideoMetadata(id, body);
    return NextResponse.json(video);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update video";
    const status =
      message === "Unauthorized" ? 401 : message === "Video not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
