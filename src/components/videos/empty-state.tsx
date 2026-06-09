import { FileVideo } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/60 bg-slate-900/30 px-4 py-12 text-center sm:px-6 sm:py-16">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80">
        <FileVideo className="h-5 w-5 text-slate-500" />
      </div>
      <h3 className="text-base font-medium text-slate-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
