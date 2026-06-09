"use client";

import type { Phase } from "@/generated/prisma/client";
import { Check } from "lucide-react";
import { PHASE_LABELS } from "@/lib/constants";
import { cn, formatTimestamp } from "@/lib/utils";

type PhaseMarkerButtonProps = {
  phase: Phase;
  isMarked: boolean;
  markerTimestamp?: number | null;
  markerFrameNumber?: number | null;
  isActive?: boolean;
  disabled?: boolean;
  saving?: boolean;
  onMark: (phase: Phase) => void;
};

export function PhaseMarkerButton({
  phase,
  isMarked,
  markerTimestamp,
  markerFrameNumber,
  isActive,
  disabled,
  saving,
  onMark,
}: PhaseMarkerButtonProps) {
  const shortLabel =
    phase === "FOLLOW_THROUGH" ? "FOLLOW" : PHASE_LABELS[phase].toUpperCase();

  return (
    <button
      type="button"
      disabled={disabled || saving}
      onClick={() => onMark(phase)}
      className={cn(
        "flex min-h-[56px] flex-col items-start justify-center rounded-lg border px-3 py-2.5 text-left transition-colors",
        "active:scale-[0.98] disabled:opacity-50",
        isMarked
          ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-100"
          : "border-slate-700/60 bg-slate-950/50 text-slate-200 active:bg-slate-800/80",
        isActive && "ring-2 ring-cyan-400/40",
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="text-sm font-semibold tracking-wide">{shortLabel}</span>
        {isMarked ? (
          <Check className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden />
        ) : (
          <span className="text-[11px] text-slate-500">Tap to mark</span>
        )}
      </div>
      {isMarked && markerFrameNumber != null ? (
        <span className="mt-0.5 text-xs tabular-nums text-cyan-300/80">
          f{markerFrameNumber}
          {markerTimestamp != null
            ? ` · ${formatTimestamp(markerTimestamp)}`
            : null}
        </span>
      ) : null}
    </button>
  );
}
