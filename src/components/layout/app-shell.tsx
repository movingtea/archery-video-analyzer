import { Sidebar } from "@/components/layout/sidebar";
import { signOutAction } from "@/lib/actions/auth";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#080B12] text-slate-50">
      <Sidebar onSignOut={signOutAction} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
