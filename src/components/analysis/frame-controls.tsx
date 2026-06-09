"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTimestamp } from "@/lib/utils";

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
  onSkipBackward?: () => void;
  onSkipForward?: () => void;
  onFpsChange: (fps: number) => void;
};

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
  onSkipBackward,
  onSkipForward,
  onFpsChange,
}: FrameControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-700/60 bg-slate-900/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            onClick={onSkipBackward ?? onStepBackward}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={onStepBackward}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" onClick={onPlayPause}>
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="secondary" size="icon" onClick={onStepForward}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={onSkipForward ?? onStepForward}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="fps" className="text-xs text-slate-500">
            FPS
          </Label>
          <Input
            id="fps"
            type="number"
            min={1}
            max={240}
            step={1}
            value={fps}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (value > 0) onFpsChange(value);
            }}
            className="h-8 w-20"
          />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.001}
        value={currentTime}
        onChange={(event) => onSeek(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums text-slate-400">
        <span>
          {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
        </span>
        <span>
          Frame <span className="text-cyan-300">{frameNumber}</span>
        </span>
      </div>
    </div>
  );
}
