"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Appointment } from "./Appointements"

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    SCHEDULED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    COMPLETED: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
  }

  return (
    <Badge 
      variant="outline" 
      className={`${statusStyles[status as keyof typeof statusStyles] || "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"} capitalize`}
    >
      {status.toLowerCase()}
    </Badge>
  )
}

function FeesBadge({ fees }: { fees: number }) {
  return (
    <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
      ${fees}
    </Badge>
  )
}

export const columns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "shortId",
        header: "ID",
        cell: ({ row }) => <div className="w-[80px] font-mono">{row.getValue("shortId")}</div>,
      },
  {
    accessorKey: "doctor.name",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original.doctor
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={doctor.image || "/empty.svg"}
              alt={doctor.name}
            />
            <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>Dr. {doctor.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "doctor.speciality",
    header: "Speciality",
    cell: ({ row }) => <div>{row.original.doctor.speciality}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <StatusBadge status={status} />
    },
  },
  {
    accessorKey: "appointmentDateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Appointment Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("appointmentDateTime")}</div>,
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => {
      const fees = row.getValue("fees") as number
      return <FeesBadge fees={fees} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(appointment.id)}
            >
              Copy appointment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Update status</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

