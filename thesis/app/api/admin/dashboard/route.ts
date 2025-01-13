// import { NextResponse, NextRequest } from "next/server";
// import { getAuth } from "@clerk/nextjs/server"
// import prisma from "@/lib/db"
// import { startOfMonth, subMonths, startOfYesterday, endOfYesterday } from "date-fns"

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = getAuth(request)
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get current and last month dates
//     const currentMonth = new Date()
//     const lastMonth = subMonths(currentMonth, 1)
//     const yesterday = startOfYesterday()
//     const yesterdayEnd = endOfYesterday()

//    // Get total appointments and revenue
//    const [totalAppointments, totalRevenue] = await prisma.$transaction([
//     prisma.appointment.count(),
//     prisma.appointment.aggregate({
//       _sum: {
//         fees: true
//       }
//     })
//   ])
//     // Get current and last month patients
//     const [currentMonthPatients, lastMonthPatients] = await Promise.all([
//       prisma.appointment.groupBy({
//         by: ['userId'],
//         where: {
//           createdAt: {
//             gte: startOfMonth(currentMonth),
//           },
//         },
//       }),
//       prisma.appointment.groupBy({
//         by: ['userId'],
//         where: {
//           createdAt: {
//             gte: startOfMonth(lastMonth),
//             lt: startOfMonth(currentMonth),
//           },
//         },
//       }),
//     ])
// // Calculate revenue for current and last month
// const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
//   prisma.appointment.aggregate({
//     _sum: {
//       fees: true,
//     },
//     where: {
//       createdAt: {
//         gte: startOfMonth(currentMonth),
//       },
//     },
//   }),
//   prisma.appointment.aggregate({
//     _sum: {
//       fees: true,
//     },
//     where: {
//       createdAt: {
//         gte: startOfMonth(lastMonth),
//         lt: startOfMonth(currentMonth),
//       },
//     },
//   }),
// ]);

//  // Calculate revenue change percentage
//  const currentRevenue = currentMonthRevenue._sum.fees || 0;
//  const previousRevenue = lastMonthRevenue._sum.fees || 0;
//  const revenueChange = previousRevenue
//  ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
//  : 0;



//     // Get yesterday's appointments count
//     const yesterdayAppointments = await prisma.appointment.count({
//       where: {
//         createdAt: {
//           gte: yesterday,
//           lte: yesterdayEnd,
//         },
//       },
//     })

//     // Calculate percentage changes
//     const patientChange = ((currentMonthPatients.length - lastMonthPatients.length) / lastMonthPatients.length) * 100
   
//     // Calculate patient satisfaction (this would typically come from a ratings table)
//     // For this example, we'll use a mock calculation
//     const satisfactionRate = 98.2
//     const lastMonthSatisfactionRate = 96.1
//     const satisfactionChange = satisfactionRate - lastMonthSatisfactionRate

//     return NextResponse.json({
//       totalPatients: {
//         count: currentMonthPatients.length,
//         change: patientChange.toFixed(1),
//       },
//       appointments: {
//         count: totalAppointments,
//         change: yesterdayAppointments,
//       },
//       revenue: {
//         amount: totalRevenue._sum.fees || 0,
//         change: revenueChange.toFixed(1),
//       },
//       satisfaction: {
//         rate: satisfactionRate,
//         change: satisfactionChange.toFixed(1),
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error)
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     )
//   }
// }


import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { startOfMonth, subMonths, startOfYesterday, endOfYesterday } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current and last month dates
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    const yesterday = startOfYesterday();
    const yesterdayEnd = endOfYesterday();

   // Get dashboard stats
   let dashboardStats = await prisma.dashboardStats.findFirst({
    where: { id: 1 },
  });

  // // If dashboardStats doesn't exist, create it with initial values
  // if (!dashboardStats) {
  //   await prisma.dashboardStats.create({
  //     data: {
  //       id: 1,
  //       totalAppointments: 0,
  //       totalRevenue: 0,
  //       lastMonthRevenue: 0,
  //     },
  //   });
  // }


    // Calculate total appointments and revenue for current and last month
    const [totalAppointments, totalRevenue, lastMonthRevenue] = await Promise.all([
      prisma.appointment.count({
        where: {
          status: { not: "CANCELLED" },
        },
      }),
      prisma.appointment.aggregate({
        _sum: {
          fees: true,
        },
        where: {
          status: { not: "CANCELLED" },
        },
      }),
      prisma.appointment.aggregate({
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
      }),
    ]);



    // Update dashboardStats with the latest values
    dashboardStats = await prisma.dashboardStats.upsert({
      where: { id: 1 },
      update: {
        totalAppointments,
        totalRevenue: totalRevenue._sum.fees || 0,
        lastMonthRevenue: lastMonthRevenue._sum.fees || 0,
      },
      create: {
        id: 1,
        totalAppointments,
        totalRevenue: totalRevenue._sum.fees || 0,
        lastMonthRevenue: lastMonthRevenue._sum.fees || 0,
      },
    });

    // Get total patients (unique users with appointments)
    const [currentMonthPatients, lastMonthPatients] = await Promise.all([
      prisma.appointment.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startOfMonth(currentMonth),
          },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.appointment.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startOfMonth(lastMonth),
            lt: startOfMonth(currentMonth),
          },
          status: { not: "CANCELLED" },
        },
      }),
    ]);


 

    // Get yesterday's appointments count
    const yesterdayAppointments = await prisma.appointment.count({
      where: {
        createdAt: {
          gte: yesterday,
          lte: yesterdayEnd,
        },
        status: { not: "CANCELLED" },
      },
    });


    // Calculate percentage changes
    const patientChange = lastMonthPatients.length
      ? ((currentMonthPatients.length - lastMonthPatients.length) / lastMonthPatients.length) * 100
      : 0;
    const revenueChange = dashboardStats?.lastMonthRevenue
      ? ((dashboardStats.totalRevenue - dashboardStats.lastMonthRevenue) / dashboardStats.lastMonthRevenue) * 100
      : 0;


    // Calculate patient satisfaction (this would typically come from a ratings table)
    // For this example, we'll use a mock calculation
    const satisfactionRate = 98.2;
    const lastMonthSatisfactionRate = 96.1;
    const satisfactionChange = satisfactionRate - lastMonthSatisfactionRate;

    return NextResponse.json({
      totalPatients: {
        count: currentMonthPatients.length,
        change: patientChange.toFixed(1),
      },
      appointments: {
        count: dashboardStats?.totalAppointments || 0,
        change: yesterdayAppointments,
      },
      revenue: {
        amount: dashboardStats?.totalRevenue || 0,
        change: revenueChange.toFixed(1),
      },
      satisfaction: {
        rate: satisfactionRate,
        change: satisfactionChange.toFixed(1),
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
