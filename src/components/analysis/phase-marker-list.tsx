"use client";

import Link from "next/link";
import type { Phase, PhaseMarker } from "@/generated/prisma/client";
import { ExternalLink } from "lucide-react";
import { PHASE_LABELS } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

type PhaseMarkerListProps = {
  markers: PhaseMarker[];
  shotId: string;
  onSeek?: (timestamp: number) => void;
};

export function PhaseMarkerList({
  markers,
  shotId,
  onSeek,
}: PhaseMarkerListProps) {
  const markerMap = new Map<Phase, PhaseMarker>(
    markers.map((marker) => [marker.phase, marker]),
  );

  const orderedPhases = (
    ["SETUP", "DRAW", "ANCHOR", "RELEASE", "FOLLOW_THROUGH"] as Phase[]
  ).filter((phase) => markerMap.has(phase));

  if (orderedPhases.length === 0) {
    return (
      <p className="text-sm text-slate-500">No phase markers yet for this shot.</p>
    );
  }

  return (
    <div className="space-y-2">
      {orderedPhases.map((phase) => {
        const marker = markerMap.get(phase)!;
        return (
          <div
            key={marker.id}
            className="flex min-h-[44px] items-center justify-between gap-3 rounded-md border border-slate-700/60 bg-slate-950/40 px-3 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-100">
                {PHASE_LABELS[phase]}
              </p>
              <p className="mt-0.5 text-xs tabular-nums text-slate-400">
                {formatTimestamp(marker.timestamp)} · Frame {marker.frameNumber}
              </p>
              {marker.note ? (
                <p className="mt-1 text-xs text-slate-500">{marker.note}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {onSeek ? (
                <button
                  type="button"
                  onClick={() => onSeek(marker.timestamp)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-3 text-sm font-medium text-cyan-400 active:bg-cyan-500/10"
                >
                  Go
                </button>
              ) : null}
              <Link
                href={`/shots/${shotId}`}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-slate-500 active:text-slate-300"
                aria-label="View shot detail"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
