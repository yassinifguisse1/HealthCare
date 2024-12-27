'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import axios from 'axios'

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
    return <div className="text-center">Loading appointment details...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!appointment) {
    return <div className="text-center h-screen">Appointment not found</div>
  }
console.log("appoi in booked === " , appointment)
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-lg mx-auto ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Appointment Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">
            Congratulations! Your appointment has been successfully booked.
          </p>
          <div className="space-y-2">
          <p><strong>Doctor:</strong> Dr. {appointment.doctor.name}</p>
            <p><strong>Date:</strong> {format(new Date(appointment.appointmentDateTime), 'PPP')}</p>
            <p><strong>Time:</strong> {format(new Date(appointment.appointmentDateTime), 'p')}</p>
            <p><strong>Speciality:</strong> {appointment.doctor.speciality}</p>
            <p><strong>Payment Method:</strong> {appointment.paymentMethod}</p>
          </div>
          <div className="text-center mt-6">
            <Link href="/appointments">
              <Button>View All Appointments</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

