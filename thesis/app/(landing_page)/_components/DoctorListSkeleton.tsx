import { Skeleton } from "@/components/ui/skeleton";

export function DoctorListSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="overflow-hidden group cursor-pointer">
          {/* Skeleton for the image */}
          <Skeleton className="relative aspect-square bg-gray-200" />

          <div className="p-4 space-y-2">
            {/* Skeleton for the title */}
            <Skeleton className="h-4 w-3/4 bg-gray-200" />
            {/* Skeleton for the description */}
            <Skeleton className="h-3 w-1/2 bg-gray-200" />

            {/* Skeleton for the content */}
            <Skeleton className="h-3 w-full bg-gray-200" />
            <Skeleton className="h-3 w-3/4 bg-gray-200" />
            <Skeleton className="h-3 w-1/2 bg-gray-200" />
          </div>

          <div className="p-4 flex justify-between">
            {/* Skeletons for the buttons */}
            <Skeleton className="h-8 w-20 bg-gray-200 rounded" />
            <Skeleton className="h-8 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
