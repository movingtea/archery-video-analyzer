"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Upload,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BottomNavProps = {
  onUploadClick: () => void;
};

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/videos", label: "Videos", icon: Video },
] as const;

export function BottomNav({ onUploadClick }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-700/60 bg-slate-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors",
                active ? "text-cyan-400" : "text-slate-500",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onUploadClick}
          className="flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-xs text-cyan-400 transition-colors"
        >
          <Upload className="h-5 w-5" aria-hidden />
          <span>Upload</span>
        </button>

        <Link
          href="/settings"
          className={cn(
            "flex min-h-[56px] flex-col items-center justify-center gap-1 px-2 py-2 text-xs transition-colors",
            pathname === "/settings" ? "text-cyan-400" : "text-slate-500",
          )}
        >
          <Settings className="h-5 w-5" aria-hidden />
          <span>Settings</span>
        </Link>
      </div>
    </nav>
  );
}
