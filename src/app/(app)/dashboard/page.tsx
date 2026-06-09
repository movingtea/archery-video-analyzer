import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/videos";
import { StatCard } from "@/components/dashboard/stat-card";
import { Topbar } from "@/components/layout/topbar";
import { VideoCard } from "@/components/videos/video-card";
import { VideoUploadDialog } from "@/components/videos/video-upload-dialog";
import { EmptyState } from "@/components/videos/empty-state";
import { PHASE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <Topbar
        title="Dashboard"
        description="Precision motion analysis for competitive recurve archery"
        actions={<VideoUploadDialog />}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Videos" value={stats.videoCount} />
          <StatCard label="Total Shots" value={stats.shotCount} />
          <StatCard
            label="Last Session"
            value={
              stats.lastSession ? formatDate(stats.lastSession) : "—"
            }
            hint="Most recent upload"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Recent Videos
              </h2>
              <Link
                href="/videos"
                className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {stats.recentVideos.length > 0 ? (
              <div className="space-y-3">
                {stats.recentVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    createdAt={video.createdAt}
                    duration={video.duration}
                    status={video.status}
                    shotCount={video._count.shots}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No videos yet"
                description="Upload your first training video to start manual phase marking."
                action={<VideoUploadDialog />}
              />
            )}
          </section>

          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Recent Analysis
            </h2>
            {stats.recentShots.length > 0 ? (
              <div className="space-y-3">
                {stats.recentShots.map((shot) => (
                  <Link
                    key={shot.id}
                    href={`/shots/${shot.id}`}
                    className="block rounded-lg border border-slate-700/60 bg-slate-900/70 p-4 transition-colors hover:border-cyan-500/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-100">
                          {shot.label ?? `Shot #${shot.index}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {shot.video.title}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500">
                        {shot.markers.length}/5 phases
                      </span>
                    </div>
                    {shot.markers.length > 0 ? (
                      <p className="mt-2 text-xs text-slate-400">
                        Latest: {PHASE_LABELS[shot.markers[shot.markers.length - 1].phase]}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-700/60 p-8 text-center text-sm text-slate-500">
                <Clock className="mx-auto mb-3 h-5 w-5 text-slate-600" />
                Analysis records will appear after you mark shots in the workbench.
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
