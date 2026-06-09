"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createVideo } from "@/lib/actions/videos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";

type VideoUploadDialogProps = {
  trigger?: React.ReactNode;
};

export function VideoUploadDialog({ trigger }: VideoUploadDialogProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    if (selected && !title) {
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
      setError("Please select a valid video file");
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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Upload className="h-4 w-4" />
            Upload Video
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Training Video</DialogTitle>
          <DialogDescription>
            Add a recurve bow training video for manual phase marking and frame
            analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-title">Title</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Morning session — 18m"
              disabled={uploading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-file">Video file</Label>
            <Input
              id="video-file"
              ref={fileInputRef}
              type="file"
              accept="video/*"
              disabled={uploading}
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />
            {file ? (
              <p className="text-xs text-slate-500">
                {file.name} · {formatFileSize(file.size)}
              </p>
            ) : null}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-xs text-slate-400">Uploading and processing…</p>
            </div>
          ) : null}

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
