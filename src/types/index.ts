import type { Phase, PhaseMarker, Shot, Video, VideoStatus } from "@prisma/client";

export type VideoWithCounts = Video & {
  _count: { shots: number };
};

export type ShotWithMarkers = Shot & {
  markers: PhaseMarker[];
};

export type VideoWithShots = Video & {
  shots: ShotWithMarkers[];
};

export type PhaseMarkerInput = {
  phase: Phase;
  timestamp: number;
  frameNumber: number;
  note?: string | null;
};

export type VideoPlayerHandle = {
  play: () => void;
  pause: () => void;
  seekTo: (timestamp: number) => void;
  stepForwardFrame: () => void;
  stepBackwardFrame: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getFrameNumber: () => number;
};

export type { Phase, PhaseMarker, Shot, Video, VideoStatus };
