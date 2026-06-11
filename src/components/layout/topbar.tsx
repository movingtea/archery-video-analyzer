type TopbarProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="relative shrink-0 border-b border-slate-800/80 bg-slate-900/40 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 [&_button]:min-h-11">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
