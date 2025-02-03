"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
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
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Star as LucideStar } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAppointmentStatus, AppointmentStatus } from "@/lib/appointment"
import Link from "next/link"
import { PaymentMethod, Rating, Speciality } from "@prisma/client"
import { format } from "date-fns"
import axios from "axios"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { AppointmentRating } from "./AppointmentRating"
import Loading from "../loading"
import { Spinner } from "@/components/ui/spinner"


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
  rating?: Rating
}

interface AppointmentsTableProps {
  appointments: Appointment[]
}

const ITEMS_PER_PAGE = 6

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [submittedRatings, setSubmittedRatings] = useState<{ [key: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { userId, isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/sign-in')
    }
  }, [isLoaded, isSignedIn])

  useEffect(() => {
    console.log('userId in component =======', userId)
  }, [userId])
  // check if there is appointements


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
    setIsLoading(true)
    try {
      await axios.put(`/api/appointments/${appointmentId}`, { status: "CANCELLED" })
      toast.success("Appointment cancelled successfully")
      router.refresh()
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      toast.error("Failed to cancel appointment")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAppointment = async (appointmentId: string) => {
    setIsLoading(true)

    try {
      const response = await axios.delete(`/api/appointments/${appointmentId}`);
      
      if (response.status === 200) {
        toast.success("Appointment deleted successfully");
        router.refresh();
      } else if (response.status === 400) {
        toast.error("Appointment already cancelled");
      } else {
        toast.error("Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          toast.error("Appointment already cancelled");
        } else {
          toast.error("Failed to delete appointment");
        }
      } else {
        toast.error("Failed to delete appointment");
      }
    }finally {
      setIsLoading(false)
    }
  }

  const handleRatingSubmit = async (appointmentId: string, rating: number) => {
    setIsLoading(true)

    try {
      await axios.put(`/api/appointments/${appointmentId}`, { ratingValue: rating })
      toast.success("Rating submitted successfully")
      router.refresh()
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error("Failed to submit rating")
      throw error
    }finally {
      setIsLoading(false)
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
      <div className="rounded-md border relative ">
      {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black  bg-opacity-50 z-10">
            <Spinner size="lg" className="text-primary" />
          </div>
        )}
      {isLoading && <Loading />}
        <Suspense fallback={<Loading />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                {/* <TableHead>Rating</TableHead> */}

                <TableHead className="w-[70px] ">Rating</TableHead>
                <TableHead className="w-[80px] ">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAppointments.map((appointment) => {
                const appointmentDate = new Date(
                  appointment.appointmentDateTime
                );
                const status = getAppointmentStatus(
                  appointmentDate,
                  appointment.status
                );

                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={
                              appointment.doctor.image ||
                              "/empty.svg?height=32&width=32"
                            }
                            alt={appointment.doctor.name}
                          />
                          <AvatarFallback>
                            {appointment.doctor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            Dr. {appointment.doctor.name}
                          </div>
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
                      {status === "COMPLETED" && !appointment.rating?.value && (
                        <>
                          <AppointmentRating
                            appointmentId={appointment.id}
                            onRatingSubmit={handleRatingSubmit}
                          />
                          {/* <StarRating appointment={appointment}/> */}
                        </>
                      )}
                      {status === "COMPLETED" &&
                        (appointment.rating?.value ||
                          submittedRatings[appointment.id]) && (
                          <div>
                            <StarRating appointment={appointment} />
                          </div>
                        )}
                      {status !== "COMPLETED" && (
                        <StatusBadge status={status} />
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
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
                            <Link
                              href={`/appointments/confirmation/${appointment.id}`}
                            >
                              View confirmation
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            disabled={status === "CANCELLED"}
                          >
                            Cancel appointment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                            className="text-red-600"
                          >
                            Delete appointment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Suspense>
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
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

export function StarRating({ appointment }: { appointment: Appointment }) {
  const ratingValue = appointment.rating?.value ?? 0;

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <LucideStar
          key={star}
          className={`w-6 h-6 ${
            ratingValue >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          } `}
        />
      ))}
    </div>
  );
}