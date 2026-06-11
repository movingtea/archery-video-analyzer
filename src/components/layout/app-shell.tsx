import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { UploadDialogProvider } from "@/components/videos/upload-dialog-context";
import { signOutAction } from "@/lib/actions/auth";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <UploadDialogProvider>
      <div className="relative flex h-[100dvh] overflow-hidden bg-slate-950 text-slate-50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.06),_transparent_50%)]"
        />
        <Sidebar onSignOut={signOutAction} />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {children}
          <MobileBottomNav />
        </main>
      </div>
    </UploadDialogProvider>
  );
}
