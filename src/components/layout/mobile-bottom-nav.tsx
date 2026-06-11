"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MoreHorizontal,
  Upload,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadDialog } from "@/components/videos/upload-dialog-context";
import { MobileMenuSheet } from "./mobile-menu-sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videos", label: "Videos", icon: Video },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { openUpload } = useUploadDialog();

  const isAnalysisPage = pathname.includes("/analysis");

  if (isAnalysisPage) {
    return null;
  }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700/60 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors",
                  active
                    ? "text-cyan-400"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={openUpload}
            className="flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-xs text-slate-500 transition-colors hover:text-cyan-400"
          >
            <Upload className="h-5 w-5" aria-hidden />
            <span className="font-medium">Upload</span>
          </button>

          <MobileMenuSheet
            trigger={
              <button
                type="button"
                className="flex min-h-[56px] w-full flex-col items-center justify-center gap-1 px-2 py-2 text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                <MoreHorizontal className="h-5 w-5" aria-hidden />
                <span className="font-medium">More</span>
              </button>
            }
          />
        </div>
      </nav>
    </>
  );
}
