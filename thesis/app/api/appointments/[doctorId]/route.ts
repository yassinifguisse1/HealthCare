import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from '@/lib/db'
import { appointmentSchema } from '@/lib/shema'
import { PaymentMethod, PaymentStatus } from '@prisma/client'
import axios from 'axios';


interface Proptype {
  params: { doctorId: string };
}
export async function POST(request: NextRequest, { params }: Proptype) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log('id params' ,  params.doctorId)


    const body = await request.json();
    const validation = appointmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const {
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      notes,
    } = validation.data;
    const transactionId = body.transactionId

    // Fetch doctor data to get fees
    const doctor = await prisma.doctor.findUnique({
      where: {
        id : params.doctorId,
      },
      select: { 
        id: true,
        fees: true,
        name: true,
        speciality: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const appointmentDateTime = combineDateAndTime(new Date(appointmentDate), appointmentTime);

    console.log("appointmentDate:", appointmentDate);
    console.log("appointmentTime:", appointmentTime);
    console.log("Combined datetime string:", `${appointmentDate.toISOString().split("T")[0]}T${appointmentTime}`);
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        patientName,
        patientEmail,
        doctorId:doctor.id,
        appointmentDateTime,
        status: "PENDING",
        fees: doctor.fees,
        paymentStatus: paymentMethod === PaymentMethod.CARD ? PaymentStatus.PAID : PaymentStatus.PENDING,
        paymentMethod,
        transactionId: transactionId || null,
        notes,
      },
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true,
          },
        },
      },
    });
console.log("appoi === " , appointment)

   // Send confirmation email
  // Send confirmation email using the existing send/route.ts
  const emailResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/send`, {
    to: patientEmail,
    appointmentDetails: {
      patientName,
      doctor: {
        name: doctor.name,
        speciality: doctor.speciality,
      },
      appointmentDateTime: appointment.appointmentDateTime,
      paymentMethod: appointment.paymentMethod,
    },
  });

  if (emailResponse.status !== 200) {
    console.error('Failed to send confirmation email');
    // Optionally, you could add a flag to the response indicating the email wasn't sent
  }


    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const whereClause: any = { userId }
    if (status) {
      whereClause.status = status
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true,
            image: true
          }
        }
      },
      skip,
      take: limit,
      orderBy: { appointmentDateTime: 'desc' }
    })

    const totalAppointments = await prisma.appointment.count({ where: whereClause })

    return NextResponse.json({
      appointments,
      totalPages: Math.ceil(totalAppointments / limit),
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

function combineDateAndTime(date: Date, time: string): Date {
   // Parse the date string
   const [year, month, day] = date.toISOString().split('T')[0].split('-').map(Number);
  
  // Validate time format (e.g., "10:00 AM")
  const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!timeMatch) {
    throw new Error("Invalid time format. Expected HH:mm AM/PM");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, hours, minutes, meridian] = timeMatch;
  let hours24 = parseInt(hours, 10);

  // Convert to 24-hour format
  if (meridian.toUpperCase() === "PM" && hours24 < 12) {
    hours24 += 12;
  } else if (meridian.toUpperCase() === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  // Format the time into HH:mm:ss
  const time24 = `${hours24.toString().padStart(2, "0")}:${minutes}:00`;

   
   const combinedDateTime = new Date(year, month - 1, day, hours24, parseInt(minutes, 10));
 

  // Validate combined DateTime
  if (isNaN(combinedDateTime.getTime())) {
    throw new Error("Invalid appointmentDateTime");
  }

  return combinedDateTime;
}






export async function PUT(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const appointmentId = params.doctorId

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
        userId: userId,
      },
      data: {
        status,
      },
    })

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointmentId = params.doctorId

    await prisma.appointment.delete({
      where: {
        id: appointmentId,
        userId: userId,
      },
    })

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

