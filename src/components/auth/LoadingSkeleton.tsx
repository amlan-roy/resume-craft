import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const InputSkeleton = () => {
  return (
    <div className="flex flex-col space-y-1">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-[32px] w-full rounded-xl" />
    </div>
  );
};

type LoadingSkeletonProps = {
  inputCount?: number;
  className?: string;
};
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  inputCount = 2,
  className,
}) => {
  return (
    <div className={cn(["flex flex-col space-y-3 my-6", className])}>
      {[...Array(inputCount)].map((_, i) => (
        <InputSkeleton key={i} />
      ))}
      <Skeleton className="h-10 w-36 self-center" />
    </div>
  );
};
export default LoadingSkeleton;
