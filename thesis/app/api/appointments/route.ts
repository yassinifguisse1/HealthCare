import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      redirect("/sign-in")
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

