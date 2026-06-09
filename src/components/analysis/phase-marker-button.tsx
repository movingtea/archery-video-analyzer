"use client";

import type { Phase } from "@/generated/prisma/client";
import { Check } from "lucide-react";
import { PHASE_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PhaseMarkerButtonProps = {
  phase: Phase;
  isMarked: boolean;
  isActive?: boolean;
  disabled?: boolean;
  onMark: (phase: Phase) => void;
};

export function PhaseMarkerButton({
  phase,
  isMarked,
  isActive,
  disabled,
  onMark,
}: PhaseMarkerButtonProps) {
  return (
    <Button
      type="button"
      variant={isMarked ? "default" : "outline"}
      className={cn(
        "h-auto w-full justify-between px-3 py-2.5",
        isActive && "ring-2 ring-cyan-400/40",
      )}
      disabled={disabled}
      onClick={() => onMark(phase)}
    >
      <span>{PHASE_LABELS[phase]}</span>
      {isMarked ? <Check className="h-4 w-4" /> : null}
    </Button>
  );
}
