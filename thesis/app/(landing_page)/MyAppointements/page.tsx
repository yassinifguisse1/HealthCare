// import { Suspense } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { AppointmentsTable } from "../_components/appointments-table"
// import { auth } from "@clerk/nextjs/server"
// import axios from "axios"
// import { redirect } from "next/navigation"

// async function getAppointments() {
//   const { getToken, userId } = await auth();
//   if (!userId) {
//     redirect("/sign-in");
//   }

//   try {
//     const token = await getToken({ template: "TOKEN_Healthcare" });
//     // Make sure we have a base URL
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:30001';

//     console.log(`Base URL: ${baseUrl}`); // Log the base URL
//     const response = await axios.get(`${baseUrl}/api/appointments`, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         "Cache-Control": "no-store",
//       },
//     });
//     console.log(`Response status: ${response.status}`); // Log the response status

//     // Axios throws on 4xx/5xx responses, but let's add an explicit check
//     if (response.status !== 200) {
//       throw new Error("Failed to fetch doctor");
//     }

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Error fetching doctors:", error.message);
//     } else {
//       console.error("Error fetching doctort:", error);
//     }
//     return null;
//   }
// }
// function AppointmentsTableSkeleton() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Skeleton className="h-9 w-[300px]" />
//       </div>
//       <div className="rounded-md border">
//         <div className="space-y-4 p-4">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="flex items-center gap-4">
//               <Skeleton className="h-12 w-12 rounded-full" />
//               <div className="space-y-2">
//                 <Skeleton className="h-4 w-[250px]" />
//                 <Skeleton className="h-4 w-[200px]" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default async function AppointmentsPage() {

//   return (
//     <div className="container mx-auto py-32">
//       <Card>
//         <CardHeader>
//           <CardTitle>My Appointments</CardTitle>
//           <CardDescription>
//             View and manage all your appointments
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Suspense fallback={<AppointmentsTableSkeleton />}>
//             <AppointmentsList />
//           </Suspense>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// async function AppointmentsList() {
//   const appointments = await getAppointments()

//   return <AppointmentsTable appointments={appointments} />
// }

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentsTable } from "../_components/appointments-table";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function AppointmentsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[300px]" />
      </div>
      <div className="rounded-md border">
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const token = await getToken({ template: "TOKEN_Healthcare" });
        const response = await axios.get("/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [getToken]);

  return (
    <div className="container mx-auto py-32">
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>View and manage all your appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <AppointmentsTableSkeleton />
          ) : appointments.length > 0 ? (
            <AppointmentsTable appointments={appointments} />
          ) : (
            <div className="text-center text-muted-foreground py-10">
              You don&apos;t have any appointments right now.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
