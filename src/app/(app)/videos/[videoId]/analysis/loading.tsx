export default function AnalysisLoading() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-950">
      <div className="border-b border-slate-800/80 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-800/80" />
          <div className="space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
            <div className="h-5 w-48 animate-pulse rounded bg-slate-800/80" />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-4">
          <div className="min-h-[320px] flex-1 animate-pulse rounded-xl bg-slate-900/70 ring-1 ring-slate-800/80" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-900/70 ring-1 ring-slate-800/80" />
        </div>
        <div className="hidden animate-pulse rounded-xl bg-slate-900/70 ring-1 ring-slate-800/80 lg:block" />
      </div>

      <div className="hidden border-t border-slate-800/80 p-4 lg:block">
        <div className="h-24 animate-pulse rounded-xl bg-slate-900/70 ring-1 ring-slate-800/80" />
      </div>

      <p className="sr-only">Loading analysis workbench…</p>
    </div>
  );
}
