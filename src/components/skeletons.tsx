import { Skeleton } from "@/components/ui/skeleton";

export function CafeListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="rounded-2xl border bg-card p-5" key={index}>
          <Skeleton className="mb-5 h-24" />
          <Skeleton className="mb-3 h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
