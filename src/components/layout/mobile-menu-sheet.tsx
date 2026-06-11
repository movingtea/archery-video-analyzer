"use client";

import { Crosshair, LogOut, Target } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileMenuSheetProps = {
  trigger: React.ReactNode;
};

export function MobileMenuSheet({ trigger }: MobileMenuSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh]">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <Target className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <SheetTitle>Archery Lab</SheetTitle>
              <SheetDescription>Motion Analysis · Phase 1</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-slate-700/40 bg-slate-950/40 px-4 py-3">
            <Crosshair className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-400">
              Phase 1 · Manual Marking
            </span>
          </div>

          <form action={signOutAction}>
            <Button
              type="submit"
              variant="outline"
              className="h-11 w-full justify-start"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>

          <p className="text-center text-xs text-slate-600">
            Settings and advanced options coming in later phases.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
