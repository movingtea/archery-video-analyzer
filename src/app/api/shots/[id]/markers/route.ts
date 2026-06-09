import { NextResponse } from "next/server";
import type { Phase } from "@prisma/client";
import { deletePhaseMarker, upsertPhaseMarker } from "@/lib/actions/markers";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      phase: Phase;
      timestamp: number;
      frameNumber: number;
      note?: string | null;
    };

    const marker = await upsertPhaseMarker(id, body);
    return NextResponse.json(marker);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upsert marker";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get("phase") as Phase | null;

    if (!phase) {
      return NextResponse.json({ error: "Phase is required" }, { status: 400 });
    }

    await deletePhaseMarker(id, phase);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete marker";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
