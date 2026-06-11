import { FileVideo } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/60 bg-slate-900/50 px-6 py-16 text-center backdrop-blur-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-700/60 bg-slate-950/80 shadow-[0_0_24px_rgba(34,211,238,0.06)]">
        <FileVideo className="h-6 w-6 text-cyan-400/70" />
      </div>
      <h3 className="text-base font-medium text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
