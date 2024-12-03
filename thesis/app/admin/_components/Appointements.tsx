"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const data: Appointment[] = [
  {
    id: 1,
    patient: "John Doe",
    status: "pending",
    appointment: "Jun 26, 2024, 3:47 PM",
    doctor: {
      name: "Dr. Jasmine Lee",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    fees:44
  },
  {
    id: 2,
    patient: "John Doe",
    status: "scheduled",
    appointment: "Jun 26, 2024, 3:47 PM",
    doctor: {
      name: "Dr. Jane Powell",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    fees:66
  },
  {
    id: 3,
    patient: "John Doe",
    status: "scheduled",
    appointment: "Jun 28, 2024, 5:00 PM",
    doctor: {
      name: "Dr. Alyana Cruz",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    fees:140
  },
  {
    id: 4,
    patient: "Adrian | JS Mastery",
    status: "scheduled",
    appointment: "Jun 28, 2024, 9:30 AM",
    doctor: {
      name: "Dr. Evan Peter",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    fees:663
  },
  {
    id: 5,
    patient: "Adrian | JS Mastery",
    status: "cancelled",
    appointment: "Jun 13, 2024, 12:00 PM",
    doctor: {
      name: "Dr. Leila Cameron",
      avatar: "/placeholder.svg?height=32&width=32"
    },
    fees:200
  }
]

export type Appointment = {
  id: number
  patient: string
  status: "pending" | "scheduled" | "cancelled"
  appointment: string
  doctor: {
    name: string
    avatar: string
  }
  fees:number
  
}


export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => <div>{row.getValue("patient")}</div>,
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
    accessorKey: "appointment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Appointment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("appointment")}</div>,
  },
  {
    accessorKey: "doctor",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.getValue("doctor") as { name: string; avatar: string }
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span>{doctor.name}</span>
        </div>
      )
    },
  },
  ,
  {
    accessorKey: "fees",
    header: "Fees",
    
    cell: ({ row }) => {
        const fees = row.getValue("fees") as number
        const status = row.getValue("status") as string
      return <FeesBadge fees={fees} status={status}/>
    },
  },
  {
    accessorKey: "Actions",
    id: "actions",
    cell: () => {

      return (
        // <div className="flex justify-end gap-2">
        //   <Button variant="outline" className="text-green-500 hover:text-green-600">
        //     Schedule
        //   </Button>
        //   <Button variant="outline" className="text-red-500 hover:text-red-600">
        //     Cancel
        //   </Button>
        // </div>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
  
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-green-500 hover:text-green-600">Schedule</DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 hover:text-red-600">Cancel</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      )
    },
  },
]

export default function Appointments() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4 pt-10 ">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-md md:text-xl font-bold tracking-tight">Appointments</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter patients..."
            value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("patient")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    pending: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    scheduled: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
  }

  return (
    <Badge 
      variant="outline" 
      className={`${statusStyles[status as keyof typeof statusStyles]} capitalize`}
    >
      {status}
    </Badge>
  )
}
function FeesBadge({ status  , fees}: { status: string , fees: number}) {
    const statusStyles = {
      pending: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      scheduled: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    }
   
   

  
    return (
      <Badge 
        variant="outline" 
        className={`${statusStyles[status as keyof typeof statusStyles]} capitalize`}
      >
       {fees}{" $"}
      </Badge>
    )
  }

