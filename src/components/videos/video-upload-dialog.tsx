"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createVideo } from "@/lib/actions/videos";
import {
  MAX_VIDEO_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE_LABEL,
} from "@/lib/storage/constants";
import { useIsMobile } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";

type VideoUploadDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
};

function UploadForm({
  uploading,
  progress,
  error,
  title,
  file,
  fileInputRef,
  onTitleChange,
  onFileChange,
  onUpload,
  onCancel,
}: {
  uploading: boolean;
  progress: number;
  error: string | null;
  title: string;
  file: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTitleChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onUpload: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="video-title">Title</Label>
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
        <Label htmlFor="video-file">Video file</Label>
        <Input
          id="video-file"
          ref={fileInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          disabled={uploading}
          className="h-11 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-cyan-300"
          onChange={(event) =>
            onFileChange(event.target.files?.[0] ?? null)
          }
        />
        {file ? (
          <p className="text-sm text-slate-500">
            {file.name} · {formatFileSize(file.size)}
          </p>
        ) : (
          <p className="text-sm text-slate-500">
            MP4, MOV, or other video formats · max {MAX_VIDEO_FILE_SIZE_LABEL}
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

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={uploading}
          className="min-h-11"
        >
          Cancel
        </Button>
        <Button
          onClick={onUpload}
          disabled={uploading}
          className="min-h-11"
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
    </div>
  );
}

export function VideoUploadDialog({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
}: VideoUploadDialogProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  function setOpen(nextOpen: boolean) {
    if (isControlled) {
      controlledOnOpenChange?.(nextOpen);
    } else {
      setInternalOpen(nextOpen);
    }
    if (!nextOpen) resetForm();
  }

  function resetForm() {
    setTitle("");
    setFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setError(null);

    if (!selected) return;

    if (!selected.type.startsWith("video/")) {
      setError("Please select a valid video file (video/* only)");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (selected.size > MAX_VIDEO_FILE_SIZE) {
      setError(`File exceeds ${MAX_VIDEO_FILE_SIZE_LABEL} limit`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!title) {
      const baseName = selected.name.replace(/\.[^/.]+$/, "");
      setTitle(baseName);
    }
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select a video file");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file (video/* only)");
      return;
    }

    if (file.size > MAX_VIDEO_FILE_SIZE) {
      setError(`File exceeds ${MAX_VIDEO_FILE_SIZE_LABEL} limit`);
      return;
    }

    setUploading(true);
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setProgress(40);
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const payload = (await uploadResponse.json()) as { error?: string };
        throw new Error(payload.error ?? "Upload failed");
      }

      const uploadResult = (await uploadResponse.json()) as {
        fileUrl: string;
        fileName: string;
        mimeType: string;
        size: number;
        duration?: number | null;
      };

      setProgress(75);

      const video = await createVideo({
        title: title.trim(),
        fileUrl: uploadResult.fileUrl,
        fileName: uploadResult.fileName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        duration: uploadResult.duration ?? null,
      });

      setProgress(100);
      setOpen(false);
      resetForm();
      router.push(`/videos/${video.id}/analysis`);
      router.refresh();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  }

  const defaultTrigger = (
    <Button className="min-h-11 w-full sm:w-auto">
      <Upload className="h-4 w-4" />
      Upload Video
    </Button>
  );

  const formProps = {
    uploading,
    progress,
    error,
    title,
    file,
    fileInputRef,
    onTitleChange: setTitle,
    onFileChange: handleFileChange,
    onUpload: handleUpload,
    onCancel: () => setOpen(false),
  };

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        {!hideTrigger ? (
          <SheetTrigger asChild>{trigger ?? defaultTrigger}</SheetTrigger>
        ) : null}
        <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Upload Training Video</SheetTitle>
            <SheetDescription>
              Add a training video for manual phase marking. MVP stores files
              locally in development — replace with cloud storage for production.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <UploadForm {...formProps} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger ? (
        <DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Training Video</DialogTitle>
          <DialogDescription>
            Add a training video for manual phase marking. MVP stores files
            locally in development — replace with cloud storage for production.
          </DialogDescription>
        </DialogHeader>
        <UploadForm {...formProps} />
      </DialogContent>
    </Dialog>
  );
}
