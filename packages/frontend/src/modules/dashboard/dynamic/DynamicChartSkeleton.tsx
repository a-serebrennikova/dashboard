export const DynamicChartSkeleton = () => {
  return (
    <section className="panel-surface flex min-h-[420px] flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-6 w-40 rounded bg-slate-800/70" />

        <div className="w-full sm:w-auto">
          <div className="inline-flex w-full flex-wrap gap-1 rounded-lg border border-slate-700 bg-slate-950/70 p-1">
            <div className="h-8 flex-1 rounded-md bg-slate-800/70 sm:flex-none sm:w-20" />
            <div className="h-8 flex-1 rounded-md bg-slate-800/70 sm:flex-none sm:w-20" />
            <div className="h-8 flex-1 rounded-md bg-slate-800/70 sm:flex-none sm:w-20" />
          </div>
        </div>
      </div>
      <div className="flex min-h-[320px] flex-1 items-center justify-center text-sm text-slate-500">
        Loading incidents chart...
      </div>
    </section>
  );
};
