import { NextRequest, NextResponse } from 'next/server'
export const dynamic = "force-dynamic"

import { getAuth } from "@clerk/nextjs/server"
import prisma from '@/lib/db'



/**
 * @method GET
 * @route ~/api/appointments/confirmation/%5BappointmentId%5D
 * @desc Get appointment details for confirmation
 * @access public
 **/

export async function GET(
  request: NextRequest,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.appointmentId },
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true,
          },
        },
      },
    })

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

