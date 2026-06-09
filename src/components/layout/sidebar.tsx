"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crosshair,
  LayoutDashboard,
  LogOut,
  Target,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/videos", label: "Video Library", icon: Video },
];

type SidebarProps = {
  onSignOut: () => void;
};

export function Sidebar({ onSignOut }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-700/60 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3 border-b border-slate-700/60 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
          <Target className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-50">
            Archery Lab
          </p>
          <p className="text-[11px] uppercase tracking-widest text-slate-500">
            Motion Analysis
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700/60 p-3">
        <div className="mb-3 flex items-center gap-2 rounded-md border border-slate-700/40 bg-slate-950/40 px-3 py-2">
          <Crosshair className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-500">Phase 1 · Manual Marking</span>
        </div>
        <form action={onSignOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-slate-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
