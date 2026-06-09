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
        actions={<VideoUploadDialog />}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {videos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
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
            title="Your library is empty"
            description="Upload a training video to begin marking setup, draw, anchor, release, and follow-through phases."
            action={<VideoUploadDialog />}
          />
        )}
      </div>
    </>
  );
}
