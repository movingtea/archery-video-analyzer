import Link from "next/link";
import { Clock, Film } from "lucide-react";
import type { VideoStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
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
    <Link
      href={`/videos/${id}/analysis`}
      className="group block rounded-lg border border-slate-700/60 bg-slate-900/70 p-4 transition-colors hover:border-cyan-500/30 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700/60 bg-slate-950/60">
            <Film className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-medium text-slate-50 group-hover:text-cyan-300">
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{formatDate(createdAt)}</p>
          </div>
        </div>
        <Badge variant={statusVariant[status]}>
          {VIDEO_STATUS_LABELS[status]}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatDuration(duration)}
        </span>
        <span>{shotCount} shot{shotCount !== 1 ? "s" : ""}</span>
      </div>
    </Link>
  );
}
