'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Clock, Medal, Stethoscope, Wallet } from 'lucide-react'
import { ConfettiEffect } from '@/app/(landing_page)/_components/confetti-effect'

type Appointment = {
  id: string
  appointmentDateTime: string
  paymentMethod: string
  doctor: {
    name: string
    speciality: string
  }
}

export default function AppointmentConfirmation({ params }: { params: { appointmentId: string } }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = await getToken({ template: "TOKEN_Healthcare" })
        const response = await axios.get(`/api/appointments/confirmation/${params.appointmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setAppointment(response.data)
      } catch (err) {
        console.error('Error fetching appointment:', err)
        setError('Failed to load appointment details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointment()
  }, [params.appointmentId, getToken])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-90px)] flex justify-center items-center">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <div className="text-center mt-6">
              <Skeleton className="h-10 w-3/4 mx-auto" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 h-[calc(100vh-80px)]">{error}</div>
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)] flex justify-center items-center">
        <p> Appointment not found</p>
      </div>
    );
  }
  return (
    // <div className="container mx-auto px-4 py-8 min-h-screen flex justify-center items-center">
    //   <Card className="w-full max-w-lg mx-auto ">
    //     <CardHeader>
    //       <CardTitle className="text-2xl font-bold text-center">Appointment Confirmed!</CardTitle>
    //     </CardHeader>
    //     <CardContent className="space-y-4">
    //       <p className="text-center text-lg">
    //         Congratulations! Your appointment has been successfully booked.
    //       </p>
    //       <div className="space-y-2">
    //       <p><strong>Doctor:</strong> Dr. {appointment.doctor.name}</p>
    //         <p><strong>Date:</strong> {format(new Date(appointment.appointmentDateTime), 'PPP')}</p>
    //         <p><strong>Time:</strong> {format(new Date(appointment.appointmentDateTime), 'p')}</p>
    //         <p><strong>Speciality:</strong> {appointment.doctor.speciality}</p>
    //         <p><strong>Payment Method:</strong> {appointment.paymentMethod}</p>
    //       </div>
    //       <div className="text-center mt-6">
    //         <Link href="/appointments">
    //           <Button>View All Appointments</Button>
    //         </Link>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-purple-600r to-purple-400r p-4 md:p-8">
   <ConfettiEffect />
    <div className="container mx-auto max-w-2xl ">
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent" />
          <div className="relative p-6 text-center">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 p-4">
              <Medal className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Congratulations!</h1>
            <p className="text-muted-foreground">
              Your appointment has been successfully booked
            </p>
          </div>
        </div>
        <CardContent className="space-y-6 p-6">
          <div className="rounded-lg bg-muted p-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">Dr. {appointment.doctor.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(appointment.appointmentDateTime), 'PPP')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">
                    {format(new Date(appointment.appointmentDateTime), 'p')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{appointment.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/appointments" className="flex-1">
              <Button variant="outline" className="w-full">
                View All Appointments
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

