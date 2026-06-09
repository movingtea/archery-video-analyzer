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
    <div className="space-y-4 rounded-lg border border-slate-700/60 bg-slate-900/70 p-4">
      {/* Time / frame display — prominent on mobile */}
      <div className="flex items-center justify-between gap-3 font-mono text-sm tabular-nums">
        <div className="text-slate-400">
          <span className="text-base text-slate-100 sm:text-sm">
            {formatTimestamp(currentTime)}
          </span>
          <span className="mx-1 text-slate-600">/</span>
          <span>{formatTimestamp(duration)}</span>
        </div>
        <div className="rounded-md bg-slate-950/60 px-3 py-1.5">
          <span className="text-xs text-slate-500">Frame </span>
          <span className="text-base font-semibold text-cyan-300 sm:text-sm">
            {frameNumber}
          </span>
        </div>
      </div>

      {/* Progress — taller touch target on mobile */}
      <div className="py-2">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.001}
          value={currentTime}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Video progress"
          className="h-3 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400 sm:h-1.5"
        />
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2 sm:justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Skip buttons — desktop only */}
          <Button
            variant="secondary"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={onSkipBackward ?? onStepBackward}
            aria-label="Skip back 1 second"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            onClick={onStepBackward}
            aria-label="Previous frame"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className="h-12 w-12 min-h-[48px] min-w-[48px]"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
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

          <Button
            variant="secondary"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={onSkipForward ?? onStepForward}
            aria-label="Skip forward 1 second"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
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
            className="h-11 w-20"
          />
        </div>
      </div>

      {/* FPS on mobile — below controls */}
      <div className="flex items-center gap-2 sm:hidden">
        <Label htmlFor="fps-mobile" className="shrink-0 text-xs text-slate-500">
          FPS
        </Label>
        <Input
          id="fps-mobile"
          type="number"
          min={1}
          max={240}
          step={1}
          value={fps}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (value > 0) onFpsChange(value);
          }}
          className="h-11 w-24"
        />
      </div>
    </div>
  );
}
