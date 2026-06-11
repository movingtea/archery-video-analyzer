import type { ShotWithMarkers } from "@/types";

/** Display title for manual or auto-detected shots. */
export function getShotDisplayName(shot: Pick<ShotWithMarkers, "index" | "label">) {
  return `Shot #${shot.index}`;
}

export function getShotLabelSubtitle(
  shot: Pick<ShotWithMarkers, "index" | "label">,
) {
  if (!shot.label?.trim()) return null;
  const normalized = shot.label.trim();
  if (normalized === getShotDisplayName(shot)) return null;
  return normalized;
}

export function getShotPhaseProgress(shot: Pick<ShotWithMarkers, "markers">) {
  return shot.markers.length;
}
