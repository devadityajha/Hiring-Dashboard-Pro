/**
 * Base shimmer block.
 * @param {string} className – Tailwind sizing classes (w-*, h-*, rounded-*)
 */
export function Skeleton({ className = "" }) {
  return (
    <div className={`bg-border/60 rounded-lg animate-pulse ${className}`} />
  );
}

/* ── Preset skeleton layouts ──────────────────────────── */

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-6 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-2.5 w-full rounded-full" />
      <Skeleton className="h-2 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50">
      <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 rounded ${i === 0 ? "flex-1" : "w-20"}`}
        />
      ))}
    </div>
  );
}

export function RecruiterCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-2 w-24" />
        <Skeleton className="h-2 w-16" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="flex-1 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
        <Skeleton className="w-7 h-7 rounded-lg" />
      </div>
    </div>
  );
}

export function NoteCardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-start gap-2.5">
        <Skeleton className="w-8 h-8 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>
      <div className="space-y-1.5 pl-10">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-4/5" />
        <Skeleton className="h-2.5 w-2/3" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      {/* Middle row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </div>
        ))}
      </div>
      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            {Array.from({ length: 3 }).map((_, j) => (
              <TableRowSkeleton key={j} cols={3} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} cols={4} />
      ))}
    </div>
  );
}
