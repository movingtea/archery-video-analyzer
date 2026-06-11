"use client";

import { createContext, useContext, useState } from "react";
import { VideoUploadDialog } from "./video-upload-dialog";

type UploadDialogContextValue = {
  openUpload: () => void;
};

const UploadDialogContext = createContext<UploadDialogContextValue | null>(
  null,
);

export function UploadDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <UploadDialogContext.Provider value={{ openUpload: () => setOpen(true) }}>
      {children}
      <VideoUploadDialog open={open} onOpenChange={setOpen} hideTrigger />
    </UploadDialogContext.Provider>
  );
}

export function useUploadDialog() {
  const context = useContext(UploadDialogContext);
  if (!context) {
    throw new Error("useUploadDialog must be used within UploadDialogProvider");
  }
  return context;
}
