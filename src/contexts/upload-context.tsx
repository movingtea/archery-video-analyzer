"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type UploadContextValue = {
  open: boolean;
  openUpload: () => void;
  closeUpload: () => void;
  setOpen: (open: boolean) => void;
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openUpload = useCallback(() => setOpen(true), []);
  const closeUpload = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openUpload, closeUpload, setOpen }),
    [open, openUpload, closeUpload],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUpload() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return context;
}
