"use client"

import {  useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { format } from "date-fns"
import { columns } from "./appointments-columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AppointmentDetails } from "./AppointmentDetails"
import { UpdateStatus } from "./UpdateStatus"
import { toast } from "sonner"

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

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const { getToken } = useAuth()

  const fetchAppointments = async (page: number, size: number) => {
    try {
      const token = await getToken()
      const response = await axios.get(`/api/admin/appointments?page=${page}&pageSize=${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const formattedAppointments = response.data.appointments.map((appointment: Appointment) => ({
        ...appointment,
        appointmentDateTime: format(new Date(appointment.appointment), "PPp"),
        status: appointment.status // Use the status from the database
      }))
      
      setAppointments(formattedAppointments)
      setPageCount(response.data.pageCount)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsUpdateStatusOpen(true)
  }

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    try {
      const token = await getToken()
      await axios.put('/api/admin/appointments', { id, status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setAppointments(appointments.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ))
      
      toast.success("Appointment status updated successfully")
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast.error("Failed to update appointment status")
    }
  }

  const handleCancelAppointment = async (appointment: Appointment) => {
    try {
      const token = await getToken()
      await axios.put('/api/admin/appointments', { id: appointment.id, status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setAppointments(appointments.map(app => 
        app.id === appointment.id ? { ...app, status: 'CANCELLED' } : app
      ))
      
      toast.success("Appointment cancelled successfully")
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
  }

  const handleViewConfirmation = (appointment: Appointment) => {
    // Implement view confirmation logic here
    console.log("View confirmation for appointment:", appointment.id)
  }

  useEffect(() => {
    fetchAppointments(currentPage, pageSize)
  }, [currentPage, pageSize, getToken])

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
        columns={columns(handleViewDetails, handleUpdateStatus, handleCancelAppointment, handleViewConfirmation)}
        data={appointments} 
        filterColumn="patient"
        pageCount={pageCount}
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

