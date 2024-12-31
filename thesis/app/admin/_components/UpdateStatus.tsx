import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Appointment } from "./Appointements"

interface UpdateStatusProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, newStatus: string) => void
}

export function UpdateStatus({ appointment, isOpen, onClose, onUpdateStatus }: UpdateStatusProps) {
  const [newStatus, setNewStatus] = useState(appointment.status)

  const handleUpdateStatus = () => {
    onUpdateStatus(appointment.id, newStatus)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogDescription>
            Change the status for appointment {appointment.shortId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Current Status:</span>
            <span className="col-span-3">{appointment.status.toLowerCase()}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">New Status:</span>
            <Select onValueChange={setNewStatus} defaultValue={newStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpdateStatus}>Update Status</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

