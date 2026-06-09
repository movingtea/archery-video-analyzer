import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { getDashboardStats } from "@/lib/actions/videos";
import { StatCard } from "@/components/dashboard/stat-card";
import { Topbar } from "@/components/layout/topbar";
import { VideoCard } from "@/components/videos/video-card";
import { VideoUpload } from "@/components/videos/video-upload";
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
        actions={
          <div className="hidden sm:block">
            <VideoUpload />
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6">
        {/* Mobile: prominent upload CTA first */}
        <div className="mb-5 sm:hidden">
          <VideoUpload
            trigger={
              <button
                type="button"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 text-base font-medium text-slate-950 shadow-sm shadow-cyan-500/20 active:bg-cyan-400"
              >
                Upload Video
              </button>
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
          <StatCard label="Total Videos" value={stats.videoCount} />
          <StatCard label="Total Shots" value={stats.shotCount} />
          <StatCard
            label="Last Session"
            value={
              stats.lastSession ? formatDate(stats.lastSession) : "—"
            }
            hint="Most recent upload"
            className="col-span-2 md:col-span-1"
          />
        </div>

        <section className="mt-6 sm:mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
              Recent Videos
            </h2>
            <Link
              href="/videos"
              className="inline-flex min-h-[44px] items-center gap-1 px-2 text-sm text-cyan-400 active:text-cyan-300"
            >
              View all <ArrowRight className="h-4 w-4" />
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
              action={<VideoUpload />}
            />
          )}
        </section>

        {/* Recent analysis — hidden on small mobile, shown from sm */}
        <section className="mt-8 hidden sm:block xl:mt-0">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Recent Analysis
          </h2>
          {stats.recentShots.length > 0 ? (
            <div className="space-y-3">
              {stats.recentShots.map((shot) => (
                <Link
                  key={shot.id}
                  href={`/shots/${shot.id}`}
                  className="block rounded-lg border border-slate-700/60 bg-slate-900/70 p-4 transition-colors active:border-cyan-500/30 lg:hover:border-cyan-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-100">
                        {shot.label ?? `Shot #${shot.index}`}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {shot.video.title}
                      </p>
                    </div>
                    <span className="text-sm text-slate-500">
                      {shot.markers.length}/5 phases
                    </span>
                  </div>
                  {shot.markers.length > 0 ? (
                    <p className="mt-2 text-sm text-slate-400">
                      Latest:{" "}
                      {PHASE_LABELS[shot.markers[shot.markers.length - 1].phase]}
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
    </>
  );
}
