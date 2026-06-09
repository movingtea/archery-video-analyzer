"use client";

import type { ShotWithMarkers } from "@/types";
import { PHASE_LABELS } from "@/lib/constants";

type TimelineSummaryProps = {
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  onSeek: (timestamp: number) => void;
};

/** Simplified marker summary for mobile — no full timeline bar */
export function TimelineSummary({
  shots,
  selectedShotId,
  onSeek,
}: TimelineSummaryProps) {
  const selectedShot = shots.find((s) => s.id === selectedShotId);

  if (!selectedShot || selectedShot.markers.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Mark phases above to see saved keyframes here.
      </p>
    );
  }

  const markers = [...selectedShot.markers].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
        {selectedShot.label ?? `Shot #${selectedShot.index}`} markers
      </p>
      {markers.map((marker) => (
        <button
          key={marker.id}
          type="button"
          onClick={() => onSeek(marker.timestamp)}
          className="flex w-full min-h-[44px] items-center justify-between rounded-lg border border-slate-700/60 bg-slate-950/50 px-4 py-3 text-left active:bg-slate-800/80"
        >
          <span className="text-sm font-medium text-slate-100">
            {PHASE_LABELS[marker.phase]}
          </span>
          <span className="text-sm tabular-nums text-cyan-400">
            f{marker.frameNumber}
          </span>
        </button>
      ))}
    </div>
  );
}
