"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function assertVideoOwnership(videoId: string, userId: string) {
  const video = await prisma.video.findFirst({
    where: { id: videoId, userId },
  });

  if (!video) {
    throw new Error("Video not found");
  }

  return video;
}

export async function createShot(videoId: string, label?: string | null) {
  const user = await requireUser();
  await assertVideoOwnership(videoId, user.id);

  const lastShot = await prisma.shot.findFirst({
    where: { videoId },
    orderBy: { index: "desc" },
  });

  const nextIndex = (lastShot?.index ?? 0) + 1;

  const shot = await prisma.shot.create({
    data: {
      videoId,
      index: nextIndex,
      label: label?.trim() || `Shot #${nextIndex}`,
    },
    include: { markers: true },
  });

  revalidatePath(`/videos/${videoId}/analysis`);

  return shot;
}

export async function listShotsByVideo(videoId: string) {
  const user = await requireUser();
  await assertVideoOwnership(videoId, user.id);

  return prisma.shot.findMany({
    where: { videoId },
    orderBy: { index: "asc" },
    include: { markers: { orderBy: { timestamp: "asc" } } },
  });
}

export async function getShotById(shotId: string) {
  const user = await requireUser();

  const shot = await prisma.shot.findFirst({
    where: {
      id: shotId,
      video: { userId: user.id },
    },
    include: {
      markers: { orderBy: { timestamp: "asc" } },
      video: true,
    },
  });

  if (!shot) {
    throw new Error("Shot not found");
  }

  return shot;
}

export async function updateShot(
  shotId: string,
  data: { label?: string | null; note?: string | null },
) {
  const user = await requireUser();

  const existing = await prisma.shot.findFirst({
    where: { id: shotId, video: { userId: user.id } },
  });

  if (!existing) {
    throw new Error("Shot not found");
  }

  const shot = await prisma.shot.update({
    where: { id: shotId },
    data: {
      label: data.label?.trim() || existing.label,
      note: data.note !== undefined ? data.note?.trim() || null : undefined,
    },
    include: { markers: true },
  });

  revalidatePath(`/videos/${existing.videoId}/analysis`);
  revalidatePath(`/shots/${shotId}`);

  return shot;
}

export async function deleteShot(shotId: string) {
  const user = await requireUser();

  const existing = await prisma.shot.findFirst({
    where: { id: shotId, video: { userId: user.id } },
  });

  if (!existing) {
    throw new Error("Shot not found");
  }

  await prisma.shot.delete({ where: { id: shotId } });

  revalidatePath(`/videos/${existing.videoId}/analysis`);
  revalidatePath("/dashboard");
}
