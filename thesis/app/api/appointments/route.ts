import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-dynamic"

import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"


/**
 * @method GET
 * @route ~/api/appointments
 * @desc Get all appointments for the logged in user
 * @access public
 **/
export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            speciality: true,
            image: true,
          },
        },
        rating: true
      },
      orderBy: {
        appointmentDateTime: 'desc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

