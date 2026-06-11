"use client";

import type { Phase } from "@/generated/prisma/client";
import type { PhaseMarker } from "@/generated/prisma/client";
import { Check, Circle } from "lucide-react";
import { PHASE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn, formatTimestamp } from "@/lib/utils";

type PhaseMarkerButtonProps = {
  phase: Phase;
  isMarked: boolean;
  marker?: PhaseMarker | null;
  isActive?: boolean;
  disabled?: boolean;
  onMark: (phase: Phase) => void;
};

export function PhaseMarkerButton({
  phase,
  isMarked,
  marker,
  isActive,
  disabled,
  onMark,
}: PhaseMarkerButtonProps) {
  return (
    <Button
      type="button"
      variant={isMarked ? "default" : "outline"}
      className={cn(
        "h-auto min-h-[52px] w-full flex-col items-start gap-1.5 px-3 py-3 text-left transition-all sm:min-h-[48px] sm:flex-row sm:items-center sm:justify-between sm:py-2.5",
        isMarked &&
          "border-cyan-500/50 bg-cyan-500/15 text-cyan-50 shadow-[inset_0_1px_0_rgba(34,211,238,0.15)] hover:bg-cyan-500/25",
        !isMarked &&
          "border-dashed border-slate-700/70 bg-slate-950/30 text-slate-400 hover:border-cyan-500/30 hover:bg-slate-900/60 hover:text-slate-200",
        isActive && "ring-2 ring-cyan-400/50",
      )}
      disabled={disabled}
      onClick={() => onMark(phase)}
    >
      <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
        {isMarked ? (
          <Check className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
        ) : (
          <Circle className="h-3 w-3 text-slate-600" aria-hidden />
        )}
        {PHASE_LABELS[phase]}
      </span>
      <span className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
        {isMarked && marker ? (
          <>
            <span className="text-cyan-200">f{marker.frameNumber}</span>
            <span className="text-cyan-400/70">·</span>
            <span className="text-cyan-300/90">
              {formatTimestamp(marker.timestamp)}
            </span>
          </>
        ) : (
          <span className="text-slate-500">Mark at playhead</span>
        )}
      </span>
    </Button>
  );
}
