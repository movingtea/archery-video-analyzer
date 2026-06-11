"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
        <AlertCircle className="h-6 w-6 text-red-400" />
      </div>
      <h1 className="text-lg font-semibold text-slate-100">
        Could not load workbench
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        {error.message || "Something went wrong while opening this video."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/videos">
            <ArrowLeft className="h-4 w-4" />
            Back to library
          </Link>
        </Button>
      </div>
    </div>
  );
}
