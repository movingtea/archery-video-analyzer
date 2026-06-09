"use client";

import { Plus } from "lucide-react";
import type { ShotWithMarkers } from "@/types";
import { cn } from "@/lib/utils";

type ShotSelectorChipsProps = {
  shots: ShotWithMarkers[];
  selectedShotId: string | null;
  creating?: boolean;
  onSelect: (shotId: string) => void;
  onCreate: () => void;
};

export function ShotSelectorChips({
  shots,
  selectedShotId,
  creating,
  onSelect,
  onCreate,
}: ShotSelectorChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {shots.map((shot) => {
        const markedCount = shot.markers.length;
        const isSelected = shot.id === selectedShotId;

        return (
          <button
            key={shot.id}
            type="button"
            onClick={() => onSelect(shot.id)}
            className={cn(
              "flex shrink-0 flex-col items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
              "min-h-[44px] min-w-[72px]",
              isSelected
                ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                : "border-slate-700/60 bg-slate-900/80 text-slate-300 active:bg-slate-800",
            )}
          >
            <span>{shot.label ?? `Shot ${shot.index}`}</span>
            <span className="text-[11px] font-normal text-slate-500">
              {markedCount}/5
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onCreate}
        disabled={creating}
        className={cn(
          "flex shrink-0 items-center gap-1.5 rounded-full border border-dashed border-cyan-500/40 px-4 py-2.5",
          "min-h-[44px] text-sm font-medium text-cyan-400 active:bg-cyan-500/10",
          creating && "opacity-50",
        )}
      >
        <Plus className="h-4 w-4" />
        {creating ? "Adding…" : "Add"}
      </button>
    </div>
  );
}
