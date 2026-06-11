import { notFound } from "next/navigation";
import { getVideoById } from "@/lib/actions/videos";
import { AnalysisWorkbench } from "@/components/analysis/analysis-workbench";

type AnalysisPageProps = {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function AnalysisPage({
  params,
  searchParams,
}: AnalysisPageProps) {
  const { videoId } = await params;
  const { t } = await searchParams;
  const initialTime = t ? Number(t) : undefined;

  let video;
  try {
    video = await getVideoById(videoId);
  } catch {
    notFound();
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AnalysisWorkbench
        video={video}
        initialTime={Number.isFinite(initialTime) ? initialTime : undefined}
      />
    </div>
  );
}
