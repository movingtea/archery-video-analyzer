import { Target, LogOut } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-lg space-y-6">
          <div className="flex items-center gap-4 rounded-lg border border-slate-700/60 bg-slate-900/70 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <Target className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="font-medium text-slate-100">Archery Lab</p>
              <p className="text-sm text-slate-500">Phase 1 · Manual Marking</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-5">
            <h2 className="text-sm font-medium text-slate-200">About</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Motion analysis workbench for competitive recurve archery. Upload
              training videos and mark shot phases frame by frame.
            </p>
          </div>

          <form action={signOutAction}>
            <Button
              type="submit"
              variant="outline"
              className="h-11 min-h-[44px] w-full justify-center"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
