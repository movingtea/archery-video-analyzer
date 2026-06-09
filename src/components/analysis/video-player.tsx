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
    const [isReady, setIsReady] = useState(false);

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
          const duration = video.duration || 0;
          video.currentTime = Math.max(0, Math.min(timestamp, duration));
          emitTimeUpdate();
        },
        stepForwardFrame() {
          const video = videoRef.current;
          if (!video) return;
          const duration = video.duration || 0;
          video.pause();
          video.currentTime = Math.min(
            duration,
            video.currentTime + frameStep(fps),
          );
          emitTimeUpdate();
        },
        stepBackwardFrame() {
          const video = videoRef.current;
          if (!video) return;
          video.pause();
          video.currentTime = Math.max(0, video.currentTime - frameStep(fps));
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
      setIsReady(false);
    }, [src]);

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-slate-700/60 bg-black",
          className,
        )}
      >
        <video
          ref={videoRef}
          src={src}
          className="aspect-video w-full bg-black object-contain"
          onLoadedMetadata={(event) => {
            setIsReady(true);
            onDurationChange?.(event.currentTarget.duration);
            emitTimeUpdate();
          }}
          onTimeUpdate={emitTimeUpdate}
          onPlay={() => onPlayStateChange?.(true)}
          onPause={() => onPlayStateChange?.(false)}
          onEnded={() => onPlayStateChange?.(false)}
        />
        {!isReady ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-sm text-slate-400">
            Loading video…
          </div>
        ) : null}
      </div>
    );
  },
);
