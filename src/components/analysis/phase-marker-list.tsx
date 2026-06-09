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
            className="flex items-start justify-between gap-3 rounded-md border border-slate-700/60 bg-slate-950/40 px-3 py-2"
          >
            <div>
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
            <div className="flex items-center gap-1">
              {onSeek ? (
                <button
                  type="button"
                  onClick={() => onSeek(marker.timestamp)}
                  className="rounded px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10"
                >
                  Go
                </button>
              ) : null}
              <Link
                href={`/shots/${shotId}`}
                className="rounded p-1 text-slate-500 hover:text-slate-300"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
