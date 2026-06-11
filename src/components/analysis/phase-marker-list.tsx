"use client";

import type { Phase, PhaseMarker } from "@/generated/prisma/client";
import { Check, Trash2 } from "lucide-react";
import { PHASES, PHASE_LABELS } from "@/lib/constants";
import { cn, formatTimestamp } from "@/lib/utils";

type PhaseMarkerListProps = {
  markers: PhaseMarker[];
  onSeek?: (timestamp: number) => void;
  onDelete?: (phase: Phase) => void;
  deletingPhase?: Phase | null;
  variant?: "default" | "cards";
};

export function PhaseMarkerList({
  markers,
  onSeek,
  onDelete,
  deletingPhase = null,
  variant = "default",
}: PhaseMarkerListProps) {
  const markerMap = new Map<Phase, PhaseMarker>(
    markers.map((marker) => [marker.phase, marker]),
  );

  const orderedPhases = PHASES.filter((phase) => markerMap.has(phase));

  if (orderedPhases.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-700/60 px-3 py-4 text-center text-sm text-slate-500">
        No markers yet. Pause at the current frame and tap a phase button above.
      </p>
    );
  }

  if (variant === "cards") {
    return (
      <div className="space-y-2">
        {orderedPhases.map((phase) => {
          const marker = markerMap.get(phase)!;
          return (
            <div
              key={marker.id}
              className="flex items-stretch overflow-hidden rounded-lg border border-cyan-500/25 bg-cyan-500/5"
            >
              <button
                type="button"
                onClick={() => onSeek?.(marker.timestamp)}
                className="min-w-0 flex-1 px-3 py-3 text-left transition-colors hover:bg-cyan-500/10"
              >
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-100">
                  <Check className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
                  {PHASE_LABELS[phase]}
                </p>
                <p className="mt-1 font-mono text-xs tabular-nums text-cyan-300/80">
                  {formatTimestamp(marker.timestamp)} · f{marker.frameNumber}
                </p>
                {marker.note ? (
                  <p className="mt-1 text-xs text-slate-400">{marker.note}</p>
                ) : null}
              </button>
              {onDelete ? (
                <button
                  type="button"
                  aria-label={`Delete ${PHASE_LABELS[phase]} marker`}
                  disabled={deletingPhase === phase}
                  onClick={() => onDelete(phase)}
                  className="flex w-11 shrink-0 items-center justify-center border-l border-cyan-500/20 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orderedPhases.map((phase) => {
        const marker = markerMap.get(phase)!;
        const isDeleting = deletingPhase === phase;

        return (
          <div
            key={marker.id}
            className={cn(
              "flex items-stretch overflow-hidden rounded-lg border border-cyan-500/25 bg-cyan-500/5",
              isDeleting && "opacity-50",
            )}
          >
            <button
              type="button"
              onClick={() => onSeek?.(marker.timestamp)}
              className="min-w-0 flex-1 px-3 py-2.5 text-left transition-colors hover:bg-cyan-500/10"
            >
              <p className="flex items-center gap-1.5 text-sm font-medium text-slate-100">
                <Check className="h-3.5 w-3.5 shrink-0 text-cyan-400" aria-hidden />
                {PHASE_LABELS[phase]}
              </p>
              <p className="mt-1 font-mono text-xs tabular-nums text-cyan-300/80">
                {formatTimestamp(marker.timestamp)} · f{marker.frameNumber}
              </p>
              {marker.note ? (
                <p className="mt-1 text-xs text-slate-400">{marker.note}</p>
              ) : null}
            </button>

            <div className="flex shrink-0 flex-col border-l border-cyan-500/20">
              {onSeek ? (
                <button
                  type="button"
                  onClick={() => onSeek(marker.timestamp)}
                  className="flex flex-1 items-center px-3 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10"
                >
                  Go
                </button>
              ) : null}
              {onDelete ? (
                <button
                  type="button"
                  aria-label={`Delete ${PHASE_LABELS[phase]} marker`}
                  disabled={isDeleting}
                  onClick={() => onDelete(phase)}
                  className="flex flex-1 items-center justify-center px-3 text-slate-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
