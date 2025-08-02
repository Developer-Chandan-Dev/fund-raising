// src/components/skeletons/MemberSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

const MemberSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
};

export default MemberSkeleton;