"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import type { VideoWithShots, VideoPlayerHandle } from "@/types";
import { updateVideoMetadata } from "@/lib/actions/videos";
import { FrameControls } from "./frame-controls";
import { ShotMarkerPanel } from "./shot-marker-panel";
import { Timeline } from "./timeline";
import { VideoPlayer } from "./video-player";

type AnalysisWorkbenchProps = {
  video: VideoWithShots;
  initialTime?: number;
};

export function AnalysisWorkbench({
  video,
  initialTime,
}: AnalysisWorkbenchProps) {
  const playerRef = useRef<VideoPlayerHandle>(null);
  const [shots, setShots] = useState(video.shots);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(
    video.shots[0]?.id ?? null,
  );
  const [fps, setFps] = useState(video.fps);
  const [duration, setDuration] = useState(video.duration ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [frameNumber, setFrameNumber] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

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
      setFps(nextFps);
      setSaveState("saving");
      try {
        await updateVideoMetadata(video.id, { fps: nextFps });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch {
        setSaveState("idle");
      }
    },
    [video.id],
  );

  useEffect(() => {
    if (initialTime != null && initialTime >= 0) {
      playerRef.current?.seekTo(initialTime);
    }
  }, [initialTime]);

  const handleDurationChange = useCallback(
    async (nextDuration: number) => {
      setDuration(nextDuration);
      if (!video.duration && nextDuration > 0) {
        setSaveState("saving");
        try {
          await updateVideoMetadata(video.id, { duration: nextDuration });
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 1500);
        } catch {
          setSaveState("idle");
        }
      }
    },
    [video.duration, video.id],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/videos"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700/60 text-slate-400 hover:text-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">{video.title}</h1>
            <p className="text-xs text-slate-500">Video Analysis Workbench</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Save className="h-3.5 w-3.5" />
          {saveState === "saving"
            ? "Saving…"
            : saveState === "saved"
              ? "Saved"
              : "Auto-save on marker"}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 xl:grid-cols-[1fr_360px]">
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
          <VideoPlayer
            ref={playerRef}
            src={video.fileUrl}
            fps={fps}
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
            onSkipBackward={() =>
              playerRef.current?.seekTo(
                Math.max(0, (playerRef.current?.getCurrentTime() ?? 0) - 1),
              )
            }
            onSkipForward={() =>
              playerRef.current?.seekTo(
                Math.min(
                  duration,
                  (playerRef.current?.getCurrentTime() ?? 0) + 1,
                ),
              )
            }
            onFpsChange={handleFpsChange}
          />
        </div>

        <div className="min-h-0 overflow-y-auto rounded-lg border border-slate-700/60 bg-slate-900/50 p-4">
          <ShotMarkerPanel
            videoId={video.id}
            shots={shots}
            selectedShotId={selectedShotId}
            currentTime={currentTime}
            frameNumber={frameNumber}
            onSelectShot={setSelectedShotId}
            onShotsChange={setShots}
            onSeek={handleSeek}
          />
        </div>
      </div>

      <div className="border-t border-slate-700/60 p-4">
        <Timeline
          duration={duration}
          currentTime={currentTime}
          shots={shots}
          selectedShotId={selectedShotId}
          onSeek={handleSeek}
        />
      </div>
    </div>
  );
}
