"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Save } from "lucide-react";
import type { VideoWithShots, VideoPlayerHandle } from "@/types";
import { DEFAULT_FPS, PHASE_COUNT } from "@/lib/constants";
import { updateVideoMetadata } from "@/lib/actions/videos";
import { getShotDisplayName, getShotPhaseProgress } from "@/lib/shots";
import { timeToFrameNumber } from "@/lib/video";
import { FrameControls } from "./frame-controls";
import { ShotMarkerPanel } from "./shot-marker-panel";
import { Timeline } from "./timeline";
import { VideoPlayer } from "./video-player";
import { cn } from "@/lib/utils";

type AnalysisWorkbenchProps = {
  video: VideoWithShots;
  initialTime?: number;
};

export function AnalysisWorkbench({
  video,
  initialTime,
}: AnalysisWorkbenchProps) {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const durationSavedRef = useRef(Boolean(video.duration));
  const [shots, setShots] = useState(video.shots);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(
    video.shots[0]?.id ?? null,
  );
  const [fps, setFps] = useState(video.fps || DEFAULT_FPS);
  const [duration, setDuration] = useState(video.duration ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [frameNumber, setFrameNumber] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const activeShotId =
    selectedShotId && shots.some((shot) => shot.id === selectedShotId)
      ? selectedShotId
      : (shots[0]?.id ?? null);

  const selectedShot = shots.find((shot) => shot.id === activeShotId) ?? null;

  const handleTimeUpdate = useCallback((time: number, frame: number) => {
    setCurrentTime(time);
    setFrameNumber(frame);
  }, []);

  const handleSeek = useCallback((time: number) => {
    playerRef.current?.seekTo(time);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
  }, [isPlaying]);

  const handleFpsChange = useCallback(
    async (nextFps: number) => {
      const time = playerRef.current?.getCurrentTime() ?? currentTime;
      setFps(nextFps);
      setFrameNumber(timeToFrameNumber(time, nextFps));
      setSaveState("saving");
      try {
        await updateVideoMetadata(video.id, { fps: nextFps });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        setSaveState("idle");
      }
    },
    [currentTime, video.id],
  );

  useEffect(() => {
    if (initialTime != null && initialTime >= 0) {
      playerRef.current?.seekTo(initialTime);
    }
  }, [initialTime]);

  const handleDurationChange = useCallback(
    async (nextDuration: number) => {
      if (!Number.isFinite(nextDuration) || nextDuration <= 0) return;

      setDuration(nextDuration);

      if (durationSavedRef.current) return;

      durationSavedRef.current = true;
      setSaveState("saving");
      try {
        await updateVideoMetadata(video.id, { duration: nextDuration });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        durationSavedRef.current = false;
        setSaveState("idle");
      }
    },
    [video.id],
  );

  const markerPanelProps = {
    videoId: video.id,
    shots,
    selectedShotId: activeShotId,
    currentTime,
    frameNumber,
    onSelectShot: setSelectedShotId,
    onShotsChange: setShots,
    onSeek: handleSeek,
  };

  const timelineProps = {
    duration,
    currentTime,
    shots,
    selectedShotId: activeShotId,
    onSeek: handleSeek,
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-slate-950">
      <header className="relative shrink-0 border-b border-slate-800/80 bg-slate-900/50 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/videos"
              aria-label="Back to video library"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700/60 bg-slate-900/80 text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Analysis Workbench
              </p>
              <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg">
                {video.title}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {selectedShot ? (
              <div className="hidden rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 text-right sm:block">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  Active shot
                </p>
                <p className="text-sm font-medium text-cyan-100">
                  {getShotDisplayName(selectedShot)}
                  <span className="ml-2 font-mono text-xs tabular-nums text-cyan-300/80">
                    {getShotPhaseProgress(selectedShot)}/{PHASE_COUNT}
                  </span>
                </p>
              </div>
            ) : null}

            <div
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs",
                saveState === "saved"
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                  : saveState === "saving"
                    ? "border-slate-700/60 bg-slate-900/80 text-slate-400"
                    : "border-slate-800/80 bg-slate-900/60 text-slate-500",
              )}
            >
              {saveState === "saving" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : saveState === "saved" ? (
                <Check className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <Save className="h-3.5 w-3.5" aria-hidden />
              )}
              <span>
                {saveState === "saving"
                  ? "Saving…"
                  : saveState === "saved"
                    ? "Saved"
                    : "Auto-save"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[1fr_auto]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.04),_transparent_55%)]"
        />

        <div className="relative flex min-h-0 flex-col gap-3 overflow-hidden p-3 sm:gap-4 sm:p-4 lg:row-span-1 lg:overflow-y-auto">
          <VideoPlayer
            ref={playerRef}
            src={video.fileUrl}
            fps={fps}
            className="min-h-[38vh] shadow-[0_0_40px_rgba(34,211,238,0.06)] lg:min-h-[320px] lg:flex-1"
            onTimeUpdate={handleTimeUpdate}
            onDurationChange={handleDurationChange}
            onPlayStateChange={setIsPlaying}
          />

          <FrameControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            frameNumber={frameNumber}
            fps={fps}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onStepBackward={() => playerRef.current?.stepBackwardFrame()}
            onStepForward={() => playerRef.current?.stepForwardFrame()}
            onFpsChange={handleFpsChange}
          />
        </div>

        <aside
          className={cn(
            "relative hidden min-h-0 overflow-y-auto border-l border-slate-800/80 bg-slate-900/40 p-4 lg:block",
            selectedShot && "shadow-[inset_1px_0_0_rgba(34,211,238,0.12)]",
          )}
        >
          <ShotMarkerPanel {...markerPanelProps} variant="desktop" />
        </aside>

        <footer className="hidden shrink-0 border-t border-slate-800/80 bg-slate-900/30 p-4 lg:col-span-2 lg:block">
          <Timeline {...timelineProps} variant="full" />
        </footer>

        <div className="space-y-3 border-t border-slate-800/80 p-3 sm:p-4 lg:hidden">
          <ShotMarkerPanel {...markerPanelProps} variant="mobile" />
          <Timeline {...timelineProps} variant="compact" />
        </div>
      </div>
    </div>
  );
}
