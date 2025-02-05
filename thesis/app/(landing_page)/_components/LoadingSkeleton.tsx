import { Skeleton } from "@/components/ui/skeleton"
import DoctorCardSkeleton from "./DoctorCardSkeleton"
import LoadingSkeletonAppointmentForm from "./LoadingSkeletonAppointmentForm"

export function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-36">
      <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <DoctorCardSkeleton />
        <LoadingSkeletonAppointmentForm />
      </div>
    </div>
  )
}
