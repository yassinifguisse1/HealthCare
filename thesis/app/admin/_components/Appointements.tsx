"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { format } from "date-fns"
import { columns } from "./appointments-columns"
import { DataTable } from "@/components/ui/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export type Appointment = {
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
  const { getToken } = useAuth()

  const fetchAppointments = async (page: number, size: number) => {
    try {
      const token = await getToken()
      const response = await axios.get(`/api/appointments?page=${page}&pageSize=${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const formattedAppointments = response.data.appointments.map((appointment: Appointment) => ({
        ...appointment,
        appointmentDateTime: format(new Date(appointment.appointment), "PPp"),
      }))
      
      setAppointments(formattedAppointments)
      setPageCount(response.data.pageCount)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setIsLoading(false)
    }
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
          columns={columns} 
          data={appointments} 
          filterColumn="doctor.name"
          pageCount={pageCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
        />
      </CardContent>
    </Card>
  )
}

