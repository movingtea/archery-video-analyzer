import { NextResponse } from "next/server";
import { deleteShot, getShotById, updateShot } from "@/lib/actions/shots";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const shot = await getShotById(id);
    return NextResponse.json(shot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get shot";
    const status =
      message === "Unauthorized" ? 401 : message === "Shot not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      label?: string | null;
      note?: string | null;
    };
    const shot = await updateShot(id, body);
    return NextResponse.json(shot);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update shot";
    const status =
      message === "Unauthorized" ? 401 : message === "Shot not found" ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteShot(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete shot";
    const status =
      message === "Unauthorized" ? 401 : message === "Shot not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
