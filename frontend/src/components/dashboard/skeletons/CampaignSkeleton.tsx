// src/components/skeletons/CampaignSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

const CampaignSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-5 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-3 w-1/4 ml-auto" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-9 w-24" />
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSkeleton;