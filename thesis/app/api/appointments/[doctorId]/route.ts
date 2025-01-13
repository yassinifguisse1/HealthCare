import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from '@/lib/db'
import { appointmentSchema } from '@/lib/shema'
import { NotificationType, PaymentMethod, PaymentStatus } from '@prisma/client'
import axios from 'axios';
import { redirect } from "next/navigation";
import { createNotificationAndSendEmail } from "@/lib/notificationHelper";
import { startOfMonth, subMonths } from "date-fns";

interface Proptype {
  params: { doctorId: string };
}
export async function POST(request: NextRequest, { params }: Proptype) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      redirect("/sign-in")

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
    // Calculate last month's revenue
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    const lastMonthRevenue = await prisma.appointment.aggregate({
      _sum: {
        fees: true,
      },
      where: {
        createdAt: {
          gte: startOfMonth(lastMonth),
          lt: startOfMonth(currentMonth),
        },
        status: { not: "CANCELLED" },
      },
    });

    // Update dashboard stats
    await prisma.dashboardStats.upsert({
      where: { id: 1 },
      update: {
        totalAppointments: { increment: 1 },
        totalRevenue: { increment: appointment.fees },
        lastMonthRevenue: lastMonthRevenue._sum.fees || 0,
      },
      create: {
        id: 1,
        totalAppointments: 1,
        totalRevenue: appointment.fees,
        lastMonthRevenue: lastMonthRevenue._sum.fees || 0,
      },
    });



    // Create notification and send email
    await createNotificationAndSendEmail(
      userId,
      appointment.id,
      NotificationType.REMINDER,
      `Your appointment with Dr. ${doctor.name} has been scheduled for ${appointmentDateTime.toLocaleString()}.`,
      patientEmail,
      {
        patientName,
        doctor: {
          name: doctor.name,
          speciality: doctor.speciality,
        },
        appointmentDateTime: appointment.appointmentDateTime,
        paymentMethod: appointment.paymentMethod,
      }
    );
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
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      redirect("/sign-in")
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
      // redirect("/sign-in")

    }

    const { status } = await request.json()
    const appointmentId = params.doctorId


    if (!["PENDING", "SCHEDULED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true },
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }
    // 

    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
        userId: userId,
      },
      data: {
        status,
      },
      include: {
        doctor: {
          select: {
            name: true,
            speciality: true,
          },
        },
       
      }
    })
    // send notification and email that appointment is CANCELLED
    if (status === 'CANCELLED' && appointment.status !== 'CANCELLED') {
      await updateDashboardStats(-1, -appointment.fees)
      await createNotificationAndSendEmail(
        userId,
        updatedAppointment.id,
        NotificationType.CANCELLATION,
        `Your appointment with Dr. ${updatedAppointment.doctor.name} scheduled for ${updatedAppointment.appointmentDateTime.toLocaleString()} has been cancelled.`,
        updatedAppointment.patientEmail,
        {
          patientName: updatedAppointment.patientName,
          doctor: {
            name: updatedAppointment.doctor.name,
            speciality: updatedAppointment.doctor.speciality,
          },
          appointmentDateTime: updatedAppointment.appointmentDateTime,
          paymentMethod: updatedAppointment.paymentMethod,
        }
      )
    }

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
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      // redirect("/sign-in")
    }

    const appointmentId = params.doctorId;

    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId,
        userId: userId,
      },
    });
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }
    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Appointment already cancelled" },
        { status: 400 }
      );
    }

    // Delete the appointment
    await prisma.appointment.delete({
      where: {
        id: appointmentId,
        userId: userId,
      },
    });
    // Update dashboard statistics

    await updateDashboardStats(-1, -appointment.fees);

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
async function updateDashboardStats(appointmentChange: number, revenueChange: number) {
  await prisma.dashboardStats.upsert({
    where: { id: 1 },
    update: {
      totalAppointments: { increment: appointmentChange },
      totalRevenue: { increment: revenueChange },
    },
    create: {
      id: 1,
      totalAppointments: appointmentChange,
      totalRevenue: revenueChange,
      lastMonthRevenue: 0,
    },
  });
}