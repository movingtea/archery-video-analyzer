"use client";

import type { ShotWithMarkers } from "@/types";
import { PHASE_COUNT, PHASE_LABELS, PHASE_SHORT_LABELS } from "@/lib/constants";
import { getShotDisplayName } from "@/lib/shots";
import { cn, formatTimestamp } from "@/lib/utils";

type TimelineProps = {
  duration: number;
  currentTime: number;
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  onSeek: (timestamp: number) => void;
  variant?: "full" | "compact";
};

type TimelineMarker = {
  id: string;
  phase: TimelineProps["shots"][0]["markers"][0]["phase"];
  timestamp: number;
  frameNumber: number;
  shotLabel: string;
  isSelectedShot: boolean;
};

function buildMarkers(
  shots: ShotWithMarkers[],
  selectedShotId: string | null,
  onlySelected: boolean,
): TimelineMarker[] {
  const source = onlySelected
    ? shots.filter((shot) => shot.id === selectedShotId)
    : shots;

  return source.flatMap((shot) =>
    shot.markers.map((marker) => ({
      id: marker.id,
      phase: marker.phase,
      timestamp: marker.timestamp,
      frameNumber: marker.frameNumber,
      shotLabel: getShotDisplayName(shot),
      isSelectedShot: shot.id === selectedShotId,
    })),
  );
}

export function Timeline({
  duration,
  currentTime,
  shots,
  selectedShotId,
  onSeek,
  variant = "full",
}: TimelineProps) {
  const safeDuration = duration > 0 ? duration : 1;
  const playheadPercent = Math.min(100, (currentTime / safeDuration) * 100);
  const isCompact = variant === "compact";

  const markers = buildMarkers(shots, selectedShotId, isCompact);
  const selectedShot = shots.find((shot) => shot.id === selectedShotId);
  const selectedCount = selectedShot?.markers.length ?? 0;

  function seekFromTrack(clientX: number, target: HTMLElement) {
    const rect = target.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(ratio * safeDuration);
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(34,211,238,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
            {isCompact ? "Shot markers" : "Timeline"}
          </h3>
          {!isCompact && selectedShot ? (
            <p className="mt-0.5 text-xs text-cyan-400/80">
              {getShotDisplayName(selectedShot)} · {selectedCount}/{PHASE_COUNT}{" "}
              phases marked
            </p>
          ) : null}
        </div>
        <div className="font-mono text-xs tabular-nums text-slate-400">
          <span className="text-cyan-300">{formatTimestamp(currentTime)}</span>
          <span className="text-slate-600"> / </span>
          <span>{formatTimestamp(safeDuration)}</span>
        </div>
      </div>

      <div
        role="slider"
        aria-label="Timeline scrubber"
        aria-valuemin={0}
        aria-valuemax={safeDuration}
        aria-valuenow={currentTime}
        tabIndex={0}
        onClick={(event) => seekFromTrack(event.clientX, event.currentTarget)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onSeek(Math.max(0, currentTime - 1 / 30));
          if (event.key === "ArrowRight")
            onSeek(Math.min(safeDuration, currentTime + 1 / 30));
        }}
        className="group relative h-12 cursor-pointer rounded-lg bg-slate-950/90 ring-1 ring-slate-800/80"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-lg bg-cyan-500/10 transition-[width] duration-75"
          style={{ width: `${playheadPercent}%` }}
        />
        <div
          className="absolute inset-y-1 w-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-[left] duration-75"
          style={{ left: `calc(${playheadPercent}% - 1px)` }}
        />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-300 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-[left] duration-75"
          style={{ left: `${playheadPercent}%` }}
        />

        {markers.map((marker) => {
          const left = (marker.timestamp / safeDuration) * 100;
          return (
            <button
              key={marker.id}
              type="button"
              title={`${marker.shotLabel} · ${PHASE_LABELS[marker.phase]} · ${formatTimestamp(marker.timestamp)}`}
              onClick={(event) => {
                event.stopPropagation();
                onSeek(marker.timestamp);
              }}
              className={cn(
                "absolute top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold transition-transform hover:scale-110",
                marker.isSelectedShot
                  ? "border-cyan-400 bg-cyan-500/25 text-cyan-100 shadow-[0_0_10px_rgba(34,211,238,0.35)]"
                  : "border-slate-600/80 bg-slate-800/90 text-slate-500 opacity-70 hover:opacity-100",
              )}
              style={{ left: `${left}%` }}
            >
              {PHASE_SHORT_LABELS[marker.phase]}
            </button>
          );
        })}
      </div>

      {!isCompact ? (
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
            Current shot markers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full border border-slate-600 bg-slate-800" />
            Other shots
          </span>
        </div>
      ) : null}

      {markers.length > 0 ? (
        <div
          className={cn(
            "space-y-1",
            !isCompact && "max-h-28 overflow-y-auto pr-1",
          )}
        >
          {markers
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => onSeek(marker.timestamp)}
                className={cn(
                  "flex min-h-10 w-full items-center justify-between rounded-md px-2.5 text-left text-sm transition-colors",
                  marker.isSelectedShot
                    ? "bg-cyan-500/10 text-slate-200 hover:bg-cyan-500/15"
                    : "text-slate-400 hover:bg-slate-800/60",
                )}
              >
                <span>
                  {!isCompact ? `${marker.shotLabel} · ` : ""}
                  {PHASE_LABELS[marker.phase]}
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {formatTimestamp(marker.timestamp)} · f{marker.frameNumber}
                </span>
              </button>
            ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-slate-700/60 px-3 py-3 text-center text-sm text-slate-500">
          {selectedShot
            ? "No markers on this shot yet. Pause at the current frame and mark an action phase."
            : "Create a shot, then mark action phases at the playhead."}
        </p>
      )}
    </div>
  );
}
