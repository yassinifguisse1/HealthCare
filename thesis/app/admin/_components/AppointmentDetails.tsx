import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Appointment } from "./Appointments"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Badge } from "@/components/ui/badge"
  
  interface AppointmentDetailsProps {
    appointment: Appointment
    isOpen: boolean
    onClose: () => void
  }
  
  export function AppointmentDetails({ appointment, isOpen, onClose }: AppointmentDetailsProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Appointment ID: {appointment.shortId}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={appointment.doctor.image || "/placeholder.svg?height=48&width=48"} alt={appointment.doctor.name} />
                <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">Dr. {appointment.doctor.name}</h4>
                <p className="text-sm text-muted-foreground">{appointment.doctor.speciality}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient</p>
                <p>{appointment.patient}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1">
                  {appointment.status.toLowerCase()}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                <p>{appointment.appointmentDateTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fees</p>
                <p>${appointment.fees}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  