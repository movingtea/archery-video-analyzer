type TopbarProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-slate-700/60 bg-slate-900/30 px-6 py-5 backdrop-blur-sm">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
