"use client";

import Link from "next/link";
import type { ShotWithMarkers } from "@/types";
import { PHASE_SHORT_LABELS, PHASES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ShotListProps = {
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  onSelect: (shotId: string) => void;
};

export function ShotList({ shots, selectedShotId, onSelect }: ShotListProps) {
  if (shots.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No shots yet. Create a shot to start marking phases.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {shots.map((shot) => {
        const markedPhases = new Set(shot.markers.map((m) => m.phase));
        const isSelected = shot.id === selectedShotId;

        return (
          <button
            key={shot.id}
            type="button"
            onClick={() => onSelect(shot.id)}
            className={cn(
              "w-full rounded-md border px-3 py-2.5 text-left transition-colors",
              isSelected
                ? "border-cyan-500/40 bg-cyan-500/10"
                : "border-slate-700/60 bg-slate-950/40 hover:border-slate-600",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-100">
                {shot.label ?? `Shot #${shot.index}`}
              </span>
              <Link
                href={`/shots/${shot.id}`}
                onClick={(event) => event.stopPropagation()}
                className="text-xs text-slate-500 hover:text-cyan-400"
              >
                Detail
              </Link>
            </div>
            <div className="mt-2 flex gap-1">
              {PHASES.map((phase) => (
                <span
                  key={phase}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded text-[10px] font-medium",
                    markedPhases.has(phase)
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-slate-800 text-slate-600",
                  )}
                  title={phase}
                >
                  {PHASE_SHORT_LABELS[phase]}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
