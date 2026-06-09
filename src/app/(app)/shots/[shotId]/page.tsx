import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Film } from "lucide-react";
import { getShotById } from "@/lib/actions/shots";
import { Topbar } from "@/components/layout/topbar";
import { PhaseMarkerList } from "@/components/analysis/phase-marker-list";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type ShotDetailPageProps = {
  params: Promise<{ shotId: string }>;
};

export default async function ShotDetailPage({ params }: ShotDetailPageProps) {
  const { shotId } = await params;

  let shot;
  try {
    shot = await getShotById(shotId);
  } catch {
    notFound();
  }

  return (
    <>
      <Topbar
        title={shot.label ?? `Shot #${shot.index}`}
        description={`From ${shot.video.title}`}
        actions={
          <Button variant="outline" asChild>
            <Link href={`/videos/${shot.videoId}/analysis`}>
              <Film className="h-4 w-4" />
              Open Workbench
            </Link>
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <Link
          href={`/videos/${shot.videoId}/analysis`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to analysis
        </Link>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-lg border border-slate-700/60 bg-slate-900/70 p-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Shot
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-50">
                #{shot.index}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Video
              </p>
              <p className="mt-1 text-sm text-slate-200">{shot.video.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Created
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {formatDate(shot.createdAt)}
              </p>
            </div>
            {shot.note ? (
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Note
                </p>
                <p className="mt-1 text-sm text-slate-400">{shot.note}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Phase Markers
            </h2>
            <PhaseMarkerList
              markers={shot.markers}
              shotId={shot.id}
            />
            {shot.markers.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {shot.markers.map((marker) => (
                  <Button key={marker.id} variant="outline" size="sm" asChild>
                    <Link
                      href={`/videos/${shot.videoId}/analysis?t=${marker.timestamp}`}
                    >
                      Jump to {marker.phase} @ {marker.timestamp.toFixed(2)}s
                    </Link>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
