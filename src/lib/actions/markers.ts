"use server";

import { revalidatePath } from "next/cache";
import type { Phase } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHASES } from "@/lib/constants";

async function assertShotOwnership(shotId: string, userId: string) {
  const shot = await prisma.shot.findFirst({
    where: { id: shotId, video: { userId } },
    include: { video: true },
  });

  if (!shot) {
    throw new Error("Shot not found");
  }

  return shot;
}

export async function upsertPhaseMarker(
  shotId: string,
  input: {
    phase: Phase;
    timestamp: number;
    frameNumber: number;
    note?: string | null;
  },
) {
  const user = await requireUser();
  const shot = await assertShotOwnership(shotId, user.id);

  if (!PHASES.includes(input.phase)) {
    throw new Error("Invalid phase");
  }

  const marker = await prisma.phaseMarker.upsert({
    where: {
      shotId_phase: {
        shotId,
        phase: input.phase,
      },
    },
    create: {
      shotId,
      phase: input.phase,
      timestamp: input.timestamp,
      frameNumber: input.frameNumber,
      note: input.note?.trim() || null,
    },
    update: {
      timestamp: input.timestamp,
      frameNumber: input.frameNumber,
      note: input.note?.trim() || null,
    },
  });

  revalidatePath(`/videos/${shot.videoId}/analysis`);
  revalidatePath(`/shots/${shotId}`);

  return marker;
}

export async function deletePhaseMarker(shotId: string, phase: Phase) {
  const user = await requireUser();
  const shot = await assertShotOwnership(shotId, user.id);

  await prisma.phaseMarker.delete({
    where: {
      shotId_phase: { shotId, phase },
    },
  });

  revalidatePath(`/videos/${shot.videoId}/analysis`);
  revalidatePath(`/shots/${shotId}`);
}
