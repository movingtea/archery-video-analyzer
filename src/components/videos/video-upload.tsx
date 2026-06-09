"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createVideo } from "@/lib/actions/videos";
import { useIsDesktop } from "@/hooks/use-media-query";
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
} from "@/components/ui/sheet";
import { VideoUploadForm } from "./video-upload-form";

type VideoUploadProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  showTrigger?: boolean;
};

export function VideoUpload({
  open: controlledOpen,
  onOpenChange,
  trigger,
  showTrigger = true,
}: VideoUploadProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

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
  }

  function handleFileChange(selected: File | null) {
    setFile(selected);
    setError(null);
    if (selected && !title) {
      const baseName = selected.name.replace(/\.[^/.]+$/, "");
      setTitle(baseName);
    }
  }

  function handleClose() {
    if (!uploading) {
      setOpen(false);
      resetForm();
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

  const form = (
    <VideoUploadForm
      title={title}
      file={file}
      uploading={uploading}
      progress={progress}
      error={error}
      onTitleChange={setTitle}
      onFileChange={handleFileChange}
      onUpload={handleUpload}
      onCancel={handleClose}
    />
  );

  const triggerButton =
    trigger ?? (
      <Button className="h-11 min-h-[44px]">
        <Upload className="h-4 w-4" />
        Upload Video
      </Button>
    );

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !uploading) resetForm();
          setOpen(nextOpen);
        }}
      >
        {showTrigger ? (
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        ) : null}
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Training Video</DialogTitle>
            <DialogDescription>
              Add a recurve bow training video for manual phase marking and frame
              analysis.
            </DialogDescription>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {showTrigger ? (
        <button type="button" className="contents" onClick={() => setOpen(true)}>
          {triggerButton}
        </button>
      ) : null}
      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !uploading) resetForm();
          setOpen(nextOpen);
        }}
      >
        <SheetContent side="full" className="gap-0 p-0">
          <div className="flex h-full flex-col overflow-hidden px-5 pb-8 pt-6">
            <SheetHeader className="mb-4 shrink-0">
              <SheetTitle>Upload Training Video</SheetTitle>
              <SheetDescription>
                Select a video from your library and add a title to begin
                analysis.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto">{form}</div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** @deprecated Use VideoUpload instead */
export function VideoUploadDialog(props: VideoUploadProps) {
  return <VideoUpload {...props} />;
}
