import { cn } from "@/lib/utils";

type TopbarProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function Topbar({
  title,
  description,
  actions,
  className,
}: TopbarProps) {
  return (
    <header
      className={cn(
        "shrink-0 border-b border-slate-700/60 bg-slate-900/30 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 hidden text-sm text-slate-400 sm:block">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
