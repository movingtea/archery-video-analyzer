"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";

export type VideoUploadFormProps = {
  title: string;
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  onTitleChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  onCancel: () => void;
};

export function VideoUploadForm({
  title,
  file,
  uploading,
  progress,
  error,
  onTitleChange,
  onFileChange,
  onUpload,
  onCancel,
}: VideoUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="video-title" className="text-sm">
          Title
        </Label>
        <Input
          id="video-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Morning session — 18m"
          disabled={uploading}
          className="h-11 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-file" className="text-sm">
          Video file
        </Label>
        <input
          id="video-file"
          ref={fileInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          disabled={uploading}
          className="sr-only"
          onChange={(event) =>
            onFileChange(event.target.files?.[0] ?? null)
          }
        />
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full justify-center text-base"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-5 w-5" />
          {file ? "Change video" : "Choose from library"}
        </Button>
        {file ? (
          <p className="text-sm text-slate-400">
            {file.name} · {formatFileSize(file.size)}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            Select a video from your phone or camera roll
          </p>
        )}
      </div>

      {uploading ? (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-slate-400">Uploading and processing…</p>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 min-h-[44px] w-full sm:w-auto"
          onClick={onCancel}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className="h-11 min-h-[44px] w-full sm:w-auto"
          onClick={onUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
