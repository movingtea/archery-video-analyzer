"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatTimestamp } from "@/lib/utils";

type FrameControlsProps = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  frameNumber: number;
  fps: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onFpsChange: (fps: number) => void;
  className?: string;
};

type FpsInputProps = {
  fps: number;
  onFpsChange: (fps: number) => void;
};

function FpsInput({ fps, onFpsChange }: FpsInputProps) {
  const [fpsDraft, setFpsDraft] = useState(String(fps));

  function commitFps() {
    const value = Number(fpsDraft);
    if (!Number.isFinite(value) || value <= 0 || value > 240) {
      setFpsDraft(String(fps));
      return;
    }
    if (value !== fps) {
      onFpsChange(value);
    }
  }

  return (
    <Input
      id="workbench-fps"
      type="number"
      min={1}
      max={240}
      step={1}
      value={fpsDraft}
      onChange={(event) => setFpsDraft(event.target.value)}
      onBlur={commitFps}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
        }
      }}
      className="h-10 w-20 font-mono text-sm tabular-nums"
    />
  );
}

export function FrameControls({
  isPlaying,
  currentTime,
  duration,
  frameNumber,
  fps,
  onPlayPause,
  onSeek,
  onStepBackward,
  onStepForward,
  onFpsChange,
  className,
}: FrameControlsProps) {
  return (
    <div
      className={cn(
        "shrink-0 space-y-4 rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(34,211,238,0.05)] backdrop-blur-sm",
        className,
      )}
    >
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.001}
        value={currentTime}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Video progress"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={onStepBackward}
            aria-label="Previous frame"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button size="icon" className="h-12 w-12" onClick={onPlayPause}>
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onStepForward}
            aria-label="Next frame"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="workbench-fps" className="text-xs text-slate-500">
            FPS
          </Label>
          <FpsInput key={fps} fps={fps} onFpsChange={onFpsChange} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-sm tabular-nums text-slate-400">
        <span>
          {formatTimestamp(currentTime)}
          <span className="text-slate-600"> / </span>
          {formatTimestamp(duration)}
        </span>
        <span>
          Frame <span className="text-cyan-400">{frameNumber}</span>
          <span className="text-slate-600"> · </span>
          <span>{fps} fps</span>
        </span>
      </div>
    </div>
  );
}
