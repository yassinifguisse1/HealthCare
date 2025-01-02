// Skeleton for the Appointment Form using ShadCN UI Skeleton
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function LoadingSkeletonAppointmentForm() {
  return (
    <Card >
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Patient Name Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Patient Email Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Appointment Date Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Appointment Time Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Payment Method Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <Skeleton className="h-4 w-1/4 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          {/* Doctor Info and Fees */}
          <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
            <div>
              <Skeleton className="h-6 w-1/3 mb-1" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-6 w-1/5" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export default LoadingSkeletonAppointmentForm;
