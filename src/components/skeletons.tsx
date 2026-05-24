import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("rounded-md bg-stone-200/80 shadow-inner shadow-white/50", className)}
    />
  );
}

export function CafeListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="rounded-lg border border-stone-950/10 bg-white p-5"
          key={index}
        >
          <SkeletonBlock className="mb-5 h-24" />
          <SkeletonBlock className="mb-3 h-5 w-2/3" />
          <SkeletonBlock className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
