import { isFuture, isToday } from "date-fns"

export type AppointmentStatus = "UPCOMING" | "COMPLETED" | "TODAY" | "CANCELLED"

export function getAppointmentStatus(date: Date, currentStatus: string): AppointmentStatus {
  if (currentStatus === "CANCELLED") return "CANCELLED"
  if (isToday(date)) return "TODAY"
  if (isFuture(date)) return "UPCOMING"
  return "COMPLETED"
}