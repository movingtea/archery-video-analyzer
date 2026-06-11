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
    <aside className="relative hidden h-full w-60 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/70 backdrop-blur-md lg:flex">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="flex items-center gap-3 border-b border-slate-800/80 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/25 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
          <Target className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-50">
            Archery Lab
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "border border-cyan-500/25 bg-cyan-500/10 text-cyan-300 shadow-[inset_0_1px_0_rgba(34,211,238,0.1)]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
              )}
            >
              <Icon className={cn("h-4 w-4", active && "text-cyan-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2">
          <Crosshair className="h-3.5 w-3.5 text-cyan-400/60" />
          <span className="text-xs text-slate-500">Phase 1 · Manual Marking</span>
        </div>
        <form action={onSignOut}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start text-slate-400 hover:text-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}
