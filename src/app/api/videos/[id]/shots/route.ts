import { NextResponse } from "next/server";
import { createShot, listShotsByVideo } from "@/lib/actions/shots";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const shots = await listShotsByVideo(id);
    return NextResponse.json(shots);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list shots";
    const status = message === "Unauthorized" ? 401 : 404;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      label?: string | null;
    };
    const shot = await createShot(id, body.label);
    return NextResponse.json(shot, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create shot";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
