import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Film,
  Pause,
  Play,
  Plus,
  Save,
} from "lucide-react";
import { PHASES, PHASE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AnalysisWorkbenchLayoutProps = {
  videoId: string;
  videoTitle: string;
};

const PLACEHOLDER_MARKERS = [
  { phase: "SETUP", frame: 42, time: "00:01.40" },
  { phase: "DRAW", frame: 118, time: "00:03.93" },
  { phase: "ANCHOR", frame: 186, time: "00:06.20" },
] as const;

export function AnalysisWorkbenchLayout({
  videoId,
  videoTitle,
}: AnalysisWorkbenchLayoutProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-900/40 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/videos"
            aria-label="Back to video library"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700/60 bg-slate-900/70 text-slate-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg">
              {videoTitle}
            </h1>
            <p className="text-xs text-slate-500">
              Analysis Workbench · {videoId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Save className="h-3.5 w-3.5 text-cyan-400/70" />
          <span>Auto-save on marker</span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden p-4 lg:grid-cols-[1fr_360px]">
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
          <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/70">
            <div className="flex aspect-video w-full flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/5">
                <Film className="h-7 w-7 text-cyan-400/80" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Video player placeholder
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Connect VideoPlayer component here
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          </div>

          <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="icon" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" disabled>
                  <Play className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="icon" disabled>
                  <Pause className="hidden h-4 w-4" />
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="secondary" className="font-mono tabular-nums">
                30 FPS
              </Badge>
            </div>
            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-cyan-500/60 to-cyan-400" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-xs tabular-nums text-slate-400">
              <span>00:06.20 / 00:02:22</span>
              <span>
                Frame <span className="text-cyan-400">186</span>
              </span>
            </div>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto rounded-xl border border-slate-700/60 bg-slate-900/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Shot Marking
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Phase markers at current playhead
              </p>
            </div>
            <Button size="sm" disabled>
              <Plus className="h-4 w-4" />
              New Shot
            </Button>
          </div>

          <div className="mb-4 flex gap-2">
            {["Shot 1", "Shot 2", "Shot 3"].map((shot, index) => (
              <button
                key={shot}
                type="button"
                disabled
                className={
                  index === 1
                    ? "rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300"
                    : "rounded-full border border-slate-700/60 px-3 py-1.5 text-xs text-slate-500"
                }
              >
                {shot}
              </button>
            ))}
          </div>

          <Separator className="mb-4 bg-slate-700/60" />

          <p className="mb-3 font-mono text-xs tabular-nums text-slate-500">
            Current: frame 186 · 6.20s
          </p>

          <div className="grid gap-2">
            {PHASES.map((phase) => {
              const marked = PLACEHOLDER_MARKERS.some((m) => m.phase === phase);
              return (
                <button
                  key={phase}
                  type="button"
                  disabled
                  className={
                    marked
                      ? "flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-3 text-left text-sm text-cyan-100"
                      : "flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-950/40 px-3 py-3 text-left text-sm text-slate-300"
                  }
                >
                  <span className="font-medium uppercase tracking-wide">
                    {PHASE_LABELS[phase]}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-slate-500">
                    {marked ? "marked" : "—"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Marked phases
            </p>
            {PLACEHOLDER_MARKERS.map((marker) => (
              <div
                key={marker.phase}
                className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-950/40 px-3 py-2"
              >
                <span className="text-sm text-slate-200">
                  {PHASE_LABELS[marker.phase]}
                </span>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  f{marker.frame} · {marker.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-800/80 bg-slate-900/30 p-4">
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Timeline
            </h3>
            <span className="text-xs text-slate-500">3 markers</span>
          </div>
          <div className="relative h-14 rounded-lg bg-slate-950/80">
            <div className="absolute inset-y-0 left-0 w-[35%] rounded-lg bg-cyan-500/10" />
            <div
              className="absolute inset-y-2 w-0.5 bg-cyan-400"
              style={{ left: "35%" }}
            />
            {PLACEHOLDER_MARKERS.map((marker, index) => (
              <div
                key={marker.phase}
                className="absolute top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-500/15 text-[10px] font-semibold text-cyan-200"
                style={{ left: `${18 + index * 12}%` }}
              >
                {marker.phase[0]}
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Timeline component connects here for seek + marker chips
          </p>
        </div>
      </div>
    </div>
  );
}
