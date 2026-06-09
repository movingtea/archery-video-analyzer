import Link from "next/link";
import { ChevronRight, Clock, Film } from "lucide-react";
import type { VideoStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VIDEO_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatDuration } from "@/lib/utils";

type VideoCardProps = {
  id: string;
  title: string;
  createdAt: Date;
  duration: number | null;
  status: VideoStatus;
  shotCount: number;
};

const statusVariant: Record<
  VideoStatus,
  "default" | "secondary" | "success" | "warning"
> = {
  PENDING: "warning",
  READY: "secondary",
  ANALYZING: "default",
  DONE: "success",
  FAILED: "warning",
};

export function VideoCard({
  id,
  title,
  createdAt,
  duration,
  status,
  shotCount,
}: VideoCardProps) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-900/70 transition-colors active:border-cyan-500/30 lg:hover:border-cyan-500/30">
      <Link
        href={`/videos/${id}/analysis`}
        className="block p-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-700/60 bg-slate-950/60">
              <Film className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-medium text-slate-50">{title}</h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>
          <Badge variant={statusVariant[status]} className="shrink-0">
            {VIDEO_STATUS_LABELS[status]}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden />
            {formatDuration(duration)}
          </span>
          <span>
            {shotCount} shot{shotCount !== 1 ? "s" : ""}
          </span>
        </div>
      </Link>

      <div className="border-t border-slate-700/40 px-4 py-3 lg:hidden">
        <Button asChild className="h-11 w-full">
          <Link href={`/videos/${id}/analysis`}>
            Open Analysis
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
