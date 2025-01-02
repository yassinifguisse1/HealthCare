// Skeleton for the Doctor Card using ShadCN UI Skeleton
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function DoctorCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Skeleton */}
        <Skeleton className="relative w-full h-96 rounded-lg" />

        {/* Doctor Info Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" /> {/* Speciality */}
          <Skeleton className="h-6 w-1/3" /> {/* Fees */}
          <Skeleton className="h-4 w-1/2" /> {/* Degree */}
          <Skeleton className="h-4 w-1/2" /> {/* Experience */}
        </div>

        {/* About Section Skeleton */}
        <div>
          <Skeleton className="h-6 w-1/4 mb-2" /> {/* About Header */}
          <Skeleton className="h-4 w-full" /> {/* About Content Line 1 */}
          <Skeleton className="h-4 w-5/6" /> {/* About Content Line 2 */}
        </div>

        {/* Address Section Skeleton */}
        <div>
          <Skeleton className="h-6 w-1/4 mb-2" /> {/* Address Header */}
          <Skeleton className="h-4 w-full" /> {/* Address Line 1 */}
          <Skeleton className="h-4 w-3/4" /> {/* Address Line 2 */}
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorCardSkeleton;
