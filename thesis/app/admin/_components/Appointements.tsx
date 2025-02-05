"use client"

import {  useEffect, useState } from "react"

import { format } from "date-fns"
import { columns } from "./appointments-columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AppointmentDetails } from "./AppointmentDetails"
import { UpdateStatus } from "./UpdateStatus"


export type Appointment = {
  appointmentDateTime: string
  id: string
  shortId: string
  patient: string
  status: "PENDING" | "SCHEDULED" | "CANCELLED" 
  appointment: string
  doctor: {
    name: string
    speciality: string
    image: string | null
  }
  fees: number
}
interface AppointmentsProps {
  appointments: Appointment[]
  updateAppointmentStatus: (id: string, newStatus: Appointment['status']) => Promise<void>
  refreshData: () => Promise<void>
}

export default function Appointments({ appointments, updateAppointmentStatus,refreshData }: AppointmentsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)


  useEffect(() => {
    setIsLoading(false)
  }, [appointments])

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsUpdateStatusOpen(true)
  }

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    await updateAppointmentStatus(id, newStatus)
    setIsUpdateStatusOpen(false)
    await refreshData()
  }

  const handleViewConfirmation = (appointment: Appointment) => {
    console.log("View confirmation for appointment:", appointment.id)
  }

  const formattedAppointments = appointments.map(appointment => ({
    ...appointment,
    appointmentDateTime: format(new Date(appointment.appointment), "PPp"),
  }))

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-[200px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
    <CardHeader>
      <CardTitle>Your Appointments</CardTitle>
    </CardHeader>
    <CardContent>
      <DataTable 
        columns={columns(handleViewDetails, handleUpdateStatus, handleViewConfirmation)}
        data={formattedAppointments} 
        filterColumn="patient"
        pageCount={Math.ceil(appointments.length / pageSize)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />
      {selectedAppointment && (
        <>
          <AppointmentDetails
            appointment={selectedAppointment}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
          <UpdateStatus
            appointment={selectedAppointment}
            isOpen={isUpdateStatusOpen}
            onClose={() => setIsUpdateStatusOpen(false)}
            onUpdateStatus={handleStatusUpdate}
          />
        </>
      )}
    </CardContent>
  </Card>
)
}

