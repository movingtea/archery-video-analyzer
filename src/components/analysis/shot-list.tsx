"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ShotWithMarkers } from "@/types";
import { PHASE_COUNT } from "@/lib/constants";
import {
  getShotDisplayName,
  getShotLabelSubtitle,
  getShotPhaseProgress,
} from "@/lib/shots";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/videos/empty-state";
import { cn } from "@/lib/utils";

type ShotListProps = {
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  onSelect: (shotId: string) => void;
  onCreateShot: () => void;
  onDeleteShot?: (shotId: string) => void;
  creating?: boolean;
  deletingId?: string | null;
  variant?: "list" | "chips";
};

export function ShotList({
  shots,
  selectedShotId,
  onSelect,
  onCreateShot,
  onDeleteShot,
  creating = false,
  deletingId = null,
  variant = "list",
}: ShotListProps) {
  if (variant === "chips") {
    if (shots.length === 0) {
      return (
        <Button
          type="button"
          variant="outline"
          onClick={onCreateShot}
          disabled={creating}
          className="min-h-11 w-full border-dashed border-cyan-500/40 text-cyan-400"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "Create first arrow"}
        </Button>
      );
    }

    return (
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {shots.map((shot) => {
          const isSelected = shot.id === selectedShotId;
          const markedCount = getShotPhaseProgress(shot);

          return (
            <button
              key={shot.id}
              type="button"
              onClick={() => onSelect(shot.id)}
              className={cn(
                "flex min-h-11 shrink-0 flex-col items-start rounded-full border px-4 py-2 text-left transition-all",
                isSelected
                  ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                  : "border-slate-700/60 bg-slate-950/40 text-slate-300",
              )}
            >
              <span className="text-sm font-medium">
                {getShotDisplayName(shot)}
              </span>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {markedCount}/{PHASE_COUNT}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={onCreateShot}
          disabled={creating}
          className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-dashed border-cyan-500/40 px-4 text-sm font-medium text-cyan-400 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Adding…" : "Add"}
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Shots
        </h2>
        <Button
          size="sm"
          onClick={onCreateShot}
          disabled={creating}
          className="min-h-9"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "New Shot"}
        </Button>
      </div>

      {shots.length === 0 ? (
        <EmptyState
          title="Create your first arrow"
          description="Each shot represents one arrow release. Add a shot, then mark setup, draw, anchor, release, and follow-through at the playhead."
          action={
            <Button onClick={onCreateShot} disabled={creating}>
              <Plus className="h-4 w-4" />
              Create Shot
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {shots.map((shot) => {
            const isSelected = shot.id === selectedShotId;
            const markedCount = getShotPhaseProgress(shot);
            const subtitle = getShotLabelSubtitle(shot);
            const isDeleting = deletingId === shot.id;
            const progress = (markedCount / PHASE_COUNT) * 100;

            return (
              <div
                key={shot.id}
                className={cn(
                  "flex items-stretch gap-1 overflow-hidden rounded-lg border transition-all",
                  isSelected
                    ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_16px_rgba(34,211,238,0.08)]"
                    : "border-slate-700/60 bg-slate-950/40 hover:border-slate-600",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(shot.id)}
                  className="min-w-0 flex-1 px-3 py-3 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-cyan-50" : "text-slate-100",
                      )}
                    >
                      {getShotDisplayName(shot)}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 font-mono text-xs tabular-nums",
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-200"
                          : "bg-slate-800 text-slate-500",
                      )}
                    >
                      {markedCount}/{PHASE_COUNT}
                    </span>
                  </div>
                  {subtitle ? (
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {subtitle}
                    </p>
                  ) : null}
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800/80">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isSelected ? "bg-cyan-400" : "bg-slate-600",
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>

                {onDeleteShot ? (
                  <button
                    type="button"
                    aria-label={`Delete ${getShotDisplayName(shot)}`}
                    disabled={isDeleting}
                    onClick={() => onDeleteShot(shot.id)}
                    className="flex w-11 shrink-0 items-center justify-center border-l border-slate-700/60 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
