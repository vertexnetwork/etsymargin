export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-6 sm:py-16">
      <div className="mb-6 sm:mb-14">
        <div className="mb-2 h-3 w-24 rounded bg-patina-100" />
        <div className="h-9 w-3/4 rounded bg-patina-100 sm:h-12" />
        <div className="mt-3 h-5 w-2/3 rounded bg-patina-100" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-patina-100 sm:p-6">
          <div className="mb-5 h-5 w-32 rounded bg-patina-100" />
          <div className="space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="mb-1.5 h-3 w-28 rounded bg-patina-100" />
                <div className="h-10 rounded-lg bg-cream-50 ring-1 ring-patina-100" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-patina-50 p-5 ring-1 ring-patina-100 sm:p-6">
            <div className="mb-2 h-3 w-24 rounded bg-patina-100" />
            <div className="h-10 w-48 rounded bg-patina-100 sm:h-12" />
            <div className="mt-5 space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full rounded bg-patina-100/70" />
              ))}
            </div>
          </div>
          <div className="h-72 rounded-2xl bg-white ring-1 ring-patina-100" />
        </div>
      </div>
    </main>
  );
}
