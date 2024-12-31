import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

async function getAppointment(id: string) {
  const user = await currentUser()
  if (!user || !user.id) {
    throw new Error("Unauthorized")
  }
  const userId = user.id

  const appointment = await prisma.appointment.findUnique({
    where: {
      id: id,
      userId: userId,
    },
    include: {
      doctor: true,
    },
  })

  if (!appointment) {
    notFound()
  }

  return appointment
}

export default async function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const appointment = await getAppointment(params.id)

  return (
    <div className="container mx-auto py-32">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.doctor.image || "/placeholder.svg"} />
                <AvatarFallback>{appointment.doctor.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">Dr. {appointment.doctor.name}</p>
                <p className="text-sm text-gray-500">{appointment.doctor.speciality}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{format(appointment.appointmentDateTime, "PPP")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Time</p>
                <p>{format(appointment.appointmentDateTime, "p")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant="outline">{appointment.status.toLowerCase()}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p className="capitalize">{appointment.paymentMethod.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fees</p>
                <p>${appointment.fees}</p>
              </div>
            </div>
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

