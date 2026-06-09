import { DEFAULT_FPS } from "./constants";

export function timeToFrameNumber(
  currentTime: number,
  fps: number = DEFAULT_FPS,
): number {
  return Math.round(currentTime * fps);
}

export function frameNumberToTime(
  frameNumber: number,
  fps: number = DEFAULT_FPS,
): number {
  return frameNumber / fps;
}

export function frameStep(fps: number = DEFAULT_FPS): number {
  return 1 / fps;
}
