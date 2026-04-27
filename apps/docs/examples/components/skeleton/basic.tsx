import { Skeleton } from "@nexu-design/ui-web";

export function SkeletonBasicExample() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}
