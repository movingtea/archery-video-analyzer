import Link from "next/link";
import { ArrowRight, Clock, Film } from "lucide-react";
import type { VideoStatus } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { VIDEO_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatDuration } from "@/lib/utils";

type VideoCardProps = {
  id: string;
  title: string;
  fileName: string;
  createdAt: Date;
  duration: number | null;
  fps: number;
  status: VideoStatus;
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
  fileName,
  createdAt,
  duration,
  fps,
  status,
}: VideoCardProps) {
  return (
    <Link
      href={`/videos/${id}/analysis`}
      className="group block rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 transition-all hover:border-cyan-500/25 hover:shadow-[0_0_24px_rgba(34,211,238,0.06)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-700/60 bg-slate-950/60">
            <Film className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-medium text-slate-50 group-hover:text-cyan-300">
              {title}
            </h3>
            <p className="mt-1 truncate text-sm text-slate-500">{fileName}</p>
          </div>
        </div>
        <Badge variant={statusVariant[status]} className="shrink-0">
          {VIDEO_STATUS_LABELS[status]}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-600">
            Duration
          </dt>
          <dd className="mt-0.5 flex items-center gap-1.5 tabular-nums text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {formatDuration(duration)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-600">FPS</dt>
          <dd className="mt-0.5 font-mono tabular-nums text-slate-300">
            {fps}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-wide text-slate-600">
            Uploaded
          </dt>
          <dd className="mt-0.5 text-slate-400">{formatDate(createdAt)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-cyan-400">
        Open analysis
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
