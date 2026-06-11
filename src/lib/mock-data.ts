import type { VideoStatus } from "@/generated/prisma/client";

export type MockVideo = {
  id: string;
  title: string;
  createdAt: Date;
  duration: number | null;
  status: VideoStatus;
  shotCount: number;
};

export type MockShotSummary = {
  id: string;
  label: string;
  videoTitle: string;
  markedPhases: number;
  latestPhase: string;
};

export const mockDashboardStats = {
  videoCount: 12,
  shotCount: 48,
  lastSession: new Date("2026-06-10T09:30:00"),
  recentVideos: [
    {
      id: "vid-001",
      title: "Morning session — 18m",
      createdAt: new Date("2026-06-10T09:30:00"),
      duration: 142,
      status: "DONE" as VideoStatus,
      shotCount: 6,
    },
    {
      id: "vid-002",
      title: "Anchor drill — side view",
      createdAt: new Date("2026-06-09T16:15:00"),
      duration: 89,
      status: "ANALYZING" as VideoStatus,
      shotCount: 3,
    },
    {
      id: "vid-003",
      title: "Release timing review",
      createdAt: new Date("2026-06-08T11:00:00"),
      duration: 64,
      status: "READY" as VideoStatus,
      shotCount: 0,
    },
  ] satisfies MockVideo[],
  recentShots: [
    {
      id: "shot-001",
      label: "Shot #4",
      videoTitle: "Morning session — 18m",
      markedPhases: 5,
      latestPhase: "Follow-through",
    },
    {
      id: "shot-002",
      label: "Shot #2",
      videoTitle: "Anchor drill — side view",
      markedPhases: 3,
      latestPhase: "Anchor",
    },
  ] satisfies MockShotSummary[],
};

export const mockVideos: MockVideo[] = [
  ...mockDashboardStats.recentVideos,
  {
    id: "vid-004",
    title: "Competition warm-up",
    createdAt: new Date("2026-06-07T08:45:00"),
    duration: 210,
    status: "DONE",
    shotCount: 12,
  },
  {
    id: "vid-005",
    title: "Draw cycle slow motion",
    createdAt: new Date("2026-06-06T14:20:00"),
    duration: 55,
    status: "PENDING",
    shotCount: 0,
  },
  {
    id: "vid-006",
    title: "Follow-through check",
    createdAt: new Date("2026-06-05T10:10:00"),
    duration: 78,
    status: "READY",
    shotCount: 2,
  },
];

export function getMockVideoById(id: string): MockVideo | undefined {
  return mockVideos.find((video) => video.id === id);
}
