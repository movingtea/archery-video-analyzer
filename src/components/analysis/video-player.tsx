"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { VideoPlayerHandle } from "@/types";
import { frameStep, timeToFrameNumber } from "@/lib/video";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
  src: string;
  fps: number;
  className?: string;
  onTimeUpdate?: (currentTime: number, frameNumber: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
};

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayer(
    {
      src,
      fps,
      className,
      onTimeUpdate,
      onDurationChange,
      onPlayStateChange,
    },
    ref,
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
      "loading",
    );

    const emitTimeUpdate = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;
      const currentTime = video.currentTime;
      onTimeUpdate?.(currentTime, timeToFrameNumber(currentTime, fps));
    }, [fps, onTimeUpdate]);

    useImperativeHandle(
      ref,
      () => ({
        play() {
          void videoRef.current?.play();
        },
        pause() {
          videoRef.current?.pause();
        },
        seekTo(timestamp: number) {
          const video = videoRef.current;
          if (!video) return;
          const maxDuration = video.duration || 0;
          video.currentTime = Math.max(0, Math.min(timestamp, maxDuration));
          emitTimeUpdate();
        },
        stepForwardFrame() {
          const video = videoRef.current;
          if (!video) return;
          const maxDuration = video.duration || 0;
          video.pause();
          video.currentTime = Math.min(
            maxDuration,
            video.currentTime + frameStep(fps),
          );
          emitTimeUpdate();
        },
        stepBackwardFrame() {
          const video = videoRef.current;
          if (!video) return;
          video.pause();
          video.currentTime = Math.max(
            0,
            video.currentTime - frameStep(fps),
          );
          emitTimeUpdate();
        },
        getCurrentTime() {
          return videoRef.current?.currentTime ?? 0;
        },
        getDuration() {
          return videoRef.current?.duration ?? 0;
        },
        getFrameNumber() {
          return timeToFrameNumber(
            videoRef.current?.currentTime ?? 0,
            fps,
          );
        },
      }),
      [emitTimeUpdate, fps],
    );

    useEffect(() => {
      setStatus("loading");
    }, [src]);

    useEffect(() => {
      emitTimeUpdate();
    }, [fps, emitTimeUpdate]);

    return (
      <div
        className={cn(
          "relative flex min-h-[220px] flex-1 overflow-hidden rounded-xl border bg-black transition-shadow",
          status === "ready"
            ? "border-slate-700/60 shadow-[0_0_32px_rgba(34,211,238,0.06)]"
            : "border-slate-700/60",
          className,
        )}
      >
        <video
          ref={videoRef}
          src={src}
          preload="metadata"
          playsInline
          className="h-full w-full bg-black object-contain"
          onLoadedMetadata={(event) => {
            setStatus("ready");
            onDurationChange?.(event.currentTarget.duration);
            emitTimeUpdate();
          }}
          onTimeUpdate={emitTimeUpdate}
          onPlay={() => onPlayStateChange?.(true)}
          onPause={() => onPlayStateChange?.(false)}
          onEnded={() => onPlayStateChange?.(false)}
          onError={() => setStatus("error")}
        />

        {status === "loading" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
            <p className="text-sm text-slate-400">Loading video…</p>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 px-6 text-center">
            <p className="text-sm text-red-400">
              Failed to load video. Check that the file exists at{" "}
              <span className="font-mono text-xs text-slate-400">{src}</span>
            </p>
          </div>
        ) : null}
      </div>
    );
  },
);
