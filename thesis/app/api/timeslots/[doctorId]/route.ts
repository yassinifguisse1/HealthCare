import { NextResponse, NextRequest } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import prisma from '@/lib/db'
import { startOfDay, endOfDay, format, parse } from 'date-fns'

// Mock or Database configuration for working hours (customize as needed)
const WORKING_HOURS = {
  start: '09:00',
  end: '17:00',
  intervalMinutes: 60, // Slot duration in minutes
}

// Utility to generate time slots
function generateTimeSlots(start: string, end: string, interval: number) {
  const startTime = parse(start, 'HH:mm', new Date())
  const endTime = parse(end, 'HH:mm', new Date())
  const slots = []

  let currentTime = startTime
  while (currentTime < endTime) {
    slots.push(format(currentTime, 'hh:mm a'))
    currentTime = new Date(currentTime.getTime() + interval * 60000)
  }

  return slots
}

export async function GET(request: NextRequest, { params }: { params: { doctorId: string } }) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const selectedDate = new Date(dateStr)

    // Validate the provided date
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Generate all possible time slots for the working hours
    const allSlots = generateTimeSlots(
      WORKING_HOURS.start,
      WORKING_HOURS.end,
      WORKING_HOURS.intervalMinutes
    )

    // Fetch appointments for the doctor on the selected date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: params.doctorId,
        appointmentDateTime: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
      },
      select: {
        appointmentDateTime: true,
      },
    })

    // Extract booked slots
    const bookedSlots = existingAppointments.map((appointment) =>
      format(appointment.appointmentDateTime, 'hh:mm a')
    )

    // Filter available slots by removing booked slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot))

//    if (availableSlots.length === 0) {
//     return NextResponse.json({ message: 'No available slots' }, { status: 200 });
// }

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

