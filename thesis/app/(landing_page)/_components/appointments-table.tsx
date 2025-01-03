"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, MoreHorizontal, Search } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAppointmentStatus, AppointmentStatus } from "@/lib/appointment"
import Link from "next/link"
import { PaymentMethod, Speciality } from "@prisma/client"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


type Doctor = {
  id: string
  name: string
  speciality: Speciality
  image: string | null
}

type Appointment = {
  id: string
  appointmentDateTime: string
  paymentMethod: PaymentMethod
  doctor: Doctor
  status: AppointmentStatus

}

interface AppointmentsTableProps {
  appointments: Appointment[]
}

const ITEMS_PER_PAGE = 6

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) =>
      appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.doctor.speciality.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [appointments, searchQuery])

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  const paginatedAppointments = useMemo(() => {
    return filteredAppointments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
  }, [filteredAppointments, currentPage])

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: "CANCELLED" })
      toast.success("Appointment cancelled successfully")
      router.refresh()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      await axios.delete(`/api/appointments/${appointmentId}`)
      toast.success("Appointment deleted successfully")
      router.refresh()
    } catch (error) {
      console.error("Error deleting appointment:", error)
      toast.error("Failed to delete appointment")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button size="sm" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAppointments.map((appointment) => {
             const appointmentDate = new Date(appointment.appointmentDateTime)
             const status = getAppointmentStatus(appointmentDate, appointment.status)

              return (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={appointment.doctor.image || '/empty.svg?height=32&width=32'}
                          alt={appointment.doctor.name}
                        />
                        <AvatarFallback>
                          {appointment.doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Dr. {appointment.doctor.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.doctor.speciality}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {format(appointmentDate, "PPP")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(appointmentDate, "p")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={status} />
                  </TableCell>
                  <TableCell className="capitalize">
                    {appointment.paymentMethod.toLowerCase()}
                  </TableCell>
                  <TableCell>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/MyAppointements/${appointment.id}`}>
                            View details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/appointments/confirmation/${appointment.id}`}>
                            View confirmation
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={status === "CANCELLED"}
                        >
                          Cancel appointment
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="text-red-600"
                        >
                          Delete appointment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: AppointmentStatus  }) {
  const statusStyles = {
    UPCOMING: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    COMPLETED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    TODAY: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 hover:bg-red-500/20"

  }

  return (
    <Badge 
      variant="outline" 
      className={`${statusStyles[status]} capitalize`}    >
      {status}
    </Badge>
  )
}

