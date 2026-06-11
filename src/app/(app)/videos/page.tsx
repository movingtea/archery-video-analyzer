import { listVideos } from "@/lib/actions/videos";
import { Topbar } from "@/components/layout/topbar";
import { VideoCard } from "@/components/videos/video-card";
import { VideoUploadDialog } from "@/components/videos/video-upload-dialog";
import { EmptyState } from "@/components/videos/empty-state";

export default async function VideosPage() {
  const videos = await listVideos();

  return (
    <>
      <Topbar
        title="Video Library"
        description="Browse and open training videos for frame-by-frame analysis"
        actions={
          <div className="hidden sm:block">
            <VideoUploadDialog />
          </div>
        }
      />

      <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 pb-24 sm:px-6 sm:py-6 lg:pb-6">
        {videos.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                fileName={video.fileName}
                createdAt={video.createdAt}
                duration={video.duration}
                fps={video.fps}
                status={video.status}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your library is empty"
            description="Upload a training video to begin marking setup, draw, anchor, release, and follow-through phases."
            action={<VideoUploadDialog />}
          />
        )}

        <div className="fixed bottom-20 right-4 z-30 sm:hidden">
          <VideoUploadDialog
            trigger={
              <button
                type="button"
                aria-label="Upload video"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 transition-colors hover:bg-cyan-400"
              >
                <span className="text-2xl leading-none">+</span>
              </button>
            }
          />
        </div>
      </div>
    </>
  );
}
