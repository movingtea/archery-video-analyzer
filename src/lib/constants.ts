import type { Phase } from "@/generated/prisma/client";

export const DEFAULT_FPS = 30;

export const PHASES: Phase[] = [
  "SETUP",
  "DRAW",
  "ANCHOR",
  "RELEASE",
  "FOLLOW_THROUGH",
];

export const PHASE_COUNT = PHASES.length;

export const PHASE_LABELS: Record<Phase, string> = {
  SETUP: "Setup",
  DRAW: "Draw",
  ANCHOR: "Anchor",
  RELEASE: "Release",
  FOLLOW_THROUGH: "Follow-through",
};

export const PHASE_SHORT_LABELS: Record<Phase, string> = {
  SETUP: "S",
  DRAW: "D",
  ANCHOR: "A",
  RELEASE: "R",
  FOLLOW_THROUGH: "F",
};

export const VIDEO_STATUS_LABELS = {
  PENDING: "Pending",
  READY: "Ready",
  ANALYZING: "Analyzing",
  DONE: "Analyzed",
  FAILED: "Failed",
} as const;
