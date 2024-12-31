
import {  isFuture, isToday } from "date-fns"
// import { AppointmentStatus } from "@prisma/client"

export type AppointmentStatus = "upcoming" | "completed" | "today"

export function getAppointmentStatus(date: Date): AppointmentStatus {
  if (isToday(date)) return "today"
  if (isFuture(date)) return "upcoming"
  return "completed"
}
