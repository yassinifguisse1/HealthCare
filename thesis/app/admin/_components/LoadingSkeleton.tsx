import DoctorCardSkeleton from "@/app/(landing_page)/_components/DoctorCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
    return (
      <div className="container mx-auto px-4 py-36">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <div className="flex justify-center items-center mx-auto container max-w-3xl ">
          <DoctorCardSkeleton  />
        </div>
      </div>
    )
  }