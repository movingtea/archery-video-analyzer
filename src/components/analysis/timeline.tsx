"use client";

import type { ShotWithMarkers } from "@/types";
import { PHASE_LABELS, PHASE_SHORT_LABELS } from "@/lib/constants";
import { cn, formatTimestamp } from "@/lib/utils";

type TimelineProps = {
  duration: number;
  currentTime: number;
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  onSeek: (timestamp: number) => void;
};

export function Timeline({
  duration,
  currentTime,
  shots,
  selectedShotId,
  onSeek,
}: TimelineProps) {
  const safeDuration = duration > 0 ? duration : 1;
  const playheadPercent = (currentTime / safeDuration) * 100;

  const allMarkers = shots.flatMap((shot) =>
    shot.markers.map((marker) => ({
      ...marker,
      shotLabel: shot.label ?? `Shot #${shot.index}`,
      shotId: shot.id,
      isSelectedShot: shot.id === selectedShotId,
    })),
  );

  return (
    <div className="space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/70 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Timeline
        </h3>
        <span className="text-xs tabular-nums text-slate-500">
          {allMarkers.length} marker{allMarkers.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="relative h-12 rounded-md bg-slate-950/80">
        <div
          className="absolute inset-y-0 left-0 rounded-md bg-cyan-500/10"
          style={{ width: `${playheadPercent}%` }}
        />
        <div
          className="absolute inset-y-2 w-0.5 bg-cyan-400"
          style={{ left: `${playheadPercent}%` }}
        />
        {allMarkers.map((marker) => {
          const left = (marker.timestamp / safeDuration) * 100;
          return (
            <button
              key={marker.id}
              type="button"
              aria-label={`${marker.shotLabel} ${PHASE_LABELS[marker.phase]} at ${formatTimestamp(marker.timestamp)}`}
              onClick={() => onSeek(marker.timestamp)}
              className={cn(
                "absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border text-[10px] font-semibold transition-transform lg:hover:scale-110",
                marker.isSelectedShot
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-200"
                  : "border-slate-600 bg-slate-800 text-slate-400",
              )}
              style={{ left: `${left}%` }}
            >
              {PHASE_SHORT_LABELS[marker.phase]}
            </button>
          );
        })}
      </div>

      {allMarkers.length > 0 ? (
        <div className="max-h-32 space-y-1 overflow-y-auto">
          {allMarkers
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => onSeek(marker.timestamp)}
                className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-slate-800/80"
              >
                <span className="text-slate-300">
                  {marker.shotLabel} · {PHASE_LABELS[marker.phase]}
                </span>
                <span className="tabular-nums text-slate-500">
                  {formatTimestamp(marker.timestamp)} · f{frameNumber(marker)}
                </span>
              </button>
            ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          Phase markers will appear on the timeline as you annotate shots.
        </p>
      )}
    </div>
  );
}

function frameNumber(marker: { frameNumber: number }) {
  return marker.frameNumber;
}
