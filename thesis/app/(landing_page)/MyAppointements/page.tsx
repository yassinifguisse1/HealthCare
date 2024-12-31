import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AppointmentsTable } from "../_components/appointments-table"
import { auth } from "@clerk/nextjs/server"
import axios from "axios"

async function getAppointments() {
  
  const { getToken } = await auth()

  try {
    const token = await getToken({ template: "TOKEN_Healthcare" });

    // Make sure we have a base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    const response = await axios.get(`${baseUrl}/api/appointments`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-store',
      },
    })
    
    // Axios throws on 4xx/5xx responses, but let's add an explicit check
    if (response.status !== 200) {
      throw new Error('Failed to fetch doctor')
    }
    
    return response.data
} catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching doctors:", error.message)
    } else {
      console.error("Error fetching doctor:", error)
    }
    return null
  }
}
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
  )
}

export default async function AppointmentsPage() {

  return (
    <div className="container mx-auto py-32">
      <Card>
        <CardHeader>
          <CardTitle>My Appointments</CardTitle>
          <CardDescription>
            View and manage all your appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<AppointmentsTableSkeleton />}>
            <AppointmentsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

async function AppointmentsList() {
  const appointments = await getAppointments()

  return <AppointmentsTable appointments={appointments} />
}

