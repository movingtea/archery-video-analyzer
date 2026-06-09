"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { VideoUpload } from "@/components/videos/video-upload";
import { UploadProvider, useUpload } from "@/contexts/upload-context";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellInner({ children }: AppShellProps) {
  const pathname = usePathname();
  const { openUpload, open, setOpen } = useUpload();

  const isAnalysisPage = /\/videos\/[^/]+\/analysis/.test(pathname);
  const showBottomNav = !isAnalysisPage;

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#080B12] text-slate-50">
      <div className="hidden lg:flex">
        <Sidebar onSignOut={signOutAction} />
      </div>

      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col overflow-hidden",
          showBottomNav && "pb-[calc(56px+env(safe-area-inset-bottom))] lg:pb-0",
        )}
      >
        {children}
      </main>

      {showBottomNav ? <BottomNav onUploadClick={openUpload} /> : null}
      <VideoUpload open={open} onOpenChange={setOpen} showTrigger={false} />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <UploadProvider>
      <AppShellInner>{children}</AppShellInner>
    </UploadProvider>
  );
}
