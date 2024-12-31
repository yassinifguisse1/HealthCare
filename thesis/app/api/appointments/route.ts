import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = parseInt(searchParams.get("pageSize") || "10")
    const skip = (page - 1) * pageSize

    // Get total count for pagination
    const total = await prisma.appointment.count()

    // Get paginated appointments
    const appointments = await prisma.appointment.findMany({
      include: {
        doctor: true,
      },
      orderBy: {
        appointmentDateTime: 'desc',
      },
      skip,
      take: pageSize,
    })

    const formattedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      shortId: appointment.id.slice(-6).toUpperCase(), // Only show last 6 characters
      patient: appointment.patientName,
      status: appointment.status,
      appointment: appointment.appointmentDateTime.toISOString(),
      doctor: {
        name: appointment.doctor.name,
        image: appointment.doctor.image,
        speciality: appointment.doctor.speciality
      },
      fees: appointment.fees
    }))

    return NextResponse.json({
      appointments: formattedAppointments,
      pageCount: Math.ceil(total / pageSize),
      total
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
