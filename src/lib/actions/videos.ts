"use server";

import { revalidatePath } from "next/cache";
import type { VideoStatus } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createVideo(input: {
  title: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
  duration?: number | null;
  fps?: number;
}) {
  const user = await requireUser();

  if (!input.title.trim()) {
    throw new Error("Title is required");
  }

  const video = await prisma.video.create({
    data: {
      userId: user.id,
      title: input.title.trim(),
      fileUrl: input.fileUrl,
      fileName: input.fileName,
      mimeType: input.mimeType,
      size: input.size,
      duration: input.duration ?? null,
      fps: input.fps ?? 30,
      status: "READY",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/videos");

  return video;
}

export async function listVideos() {
  const user = await requireUser();

  return prisma.video.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { shots: true } },
    },
  });
}

export async function getVideoById(videoId: string) {
  const user = await requireUser();

  const video = await prisma.video.findFirst({
    where: { id: videoId, userId: user.id },
    include: {
      shots: {
        orderBy: { index: "asc" },
        include: {
          markers: { orderBy: { timestamp: "asc" } },
        },
      },
    },
  });

  if (!video) {
    throw new Error("Video not found");
  }

  return video;
}

export async function updateVideoMetadata(
  videoId: string,
  data: {
    fps?: number;
    duration?: number | null;
    status?: VideoStatus;
    title?: string;
  },
) {
  const user = await requireUser();

  const existing = await prisma.video.findFirst({
    where: { id: videoId, userId: user.id },
  });

  if (!existing) {
    throw new Error("Video not found");
  }

  const video = await prisma.video.update({
    where: { id: videoId },
    data,
  });

  revalidatePath(`/videos/${videoId}/analysis`);
  revalidatePath("/videos");
  revalidatePath("/dashboard");

  return video;
}

export async function getDashboardStats() {
  const user = await requireUser();

  const [videoCount, shotCount, recentVideos, recentShots] = await Promise.all([
    prisma.video.count({ where: { userId: user.id } }),
    prisma.shot.count({
      where: { video: { userId: user.id } },
    }),
    prisma.video.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { shots: true } } },
    }),
    prisma.shot.findMany({
      where: { video: { userId: user.id } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        video: { select: { id: true, title: true } },
        markers: true,
      },
    }),
  ]);

  const lastSession = recentVideos[0]?.createdAt ?? null;

  return {
    videoCount,
    shotCount,
    lastSession,
    recentVideos,
    recentShots,
  };
}
