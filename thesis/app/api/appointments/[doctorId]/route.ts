import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from '@/lib/db'
import { appointmentSchema } from '@/lib/shema'


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
    // Fetch doctor data to get fees
    const doctor = await prisma.doctor.findUnique({
      where: {
        id : params.doctorId,
      },
      select: { 
        id:true,
        fees: true },
    });
    console.log('id' ,  params.doctorId)

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Combine date and time into a single DateTime
    // const appointmentDateTime = new Date(
    //   `${appointmentDate.toISOString().split("T")[0]}T${appointmentTime}`
    // );
    // Combine appointmentDate and appointmentTime into a single DateTime
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
        paymentStatus: "PENDING",
        paymentMethod,
        notes,
      },
    });
console.log("appoi === " , appointment)
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

  // Combine the date and time into a single ISO string
  const combinedDateTimeString = `${date.toISOString().split("T")[0]}T${time24}`;
  const combinedDateTime = new Date(combinedDateTimeString);

  // Validate combined DateTime
  if (isNaN(combinedDateTime.getTime())) {
    throw new Error("Invalid appointmentDateTime");
  }

  return combinedDateTime;
}




// // Mock or Database configuration for working hours (customize as needed)
// const WORKING_HOURS = {
//   start: '09:00 AM',
//   end: '05:00 PM',
//   intervalMinutes: 60, // Slot duration in minutes
// };

// // Utility to generate time slots
// function generateTimeSlots(start: string, end: string, interval: number) {
//   const startTime = new Date(`1970-01-01T${start}`);
//   const endTime = new Date(`1970-01-01T${end}`);
//   const slots = [];

//   while (startTime < endTime) {
//     slots.push(
//       startTime.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })
//     );
//     startTime.setMinutes(startTime.getMinutes() + interval);
//   }

//   return slots;
// }
// // Fetch time slots handler
// export default async function handler(req: NextRequest, res: NextResponse) {
//   const { method } = req;
//   const { doctorId } = req.paramd;
//   const { date } = req.query; // Date should be passed as a query parameter

//   if (method !== 'GET') {
//     return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
//   }

//   if (!doctorId || !date) {
//     return NextResponse.json({ error: 'Doctor ID and date are required' }, { status: 400 })
//   }

//   try {
//     const selectedDate = new Date(date as string);

//     // Validate the provided date
//     if (isNaN(selectedDate.getTime())) {
//       return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
//     }

//     // Generate all possible time slots for the working hours
//     const allSlots = generateTimeSlots(
//       WORKING_HOURS.start,
//       WORKING_HOURS.end,
//       WORKING_HOURS.intervalMinutes
//     );

//     // Fetch appointments for the doctor on the selected date
//     const existingAppointments = await prisma.appointment.findMany({
//       where: {
//         doctorId: doctorId as string,
//         appointmentDateTime: {
//           gte: startOfDay(selectedDate),
//           lte: endOfDay(selectedDate),
//         },
//       },
//       select: {
//         appointmentDateTime: true,
//       },
//     });

//     // Extract booked slots
//     const bookedSlots = existingAppointments.map((appointment) =>
//       new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//       })
//     );

//     // Filter available slots by removing booked slots
//     const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

//     return NextResponse.json(availableSlots, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching time slots:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }
