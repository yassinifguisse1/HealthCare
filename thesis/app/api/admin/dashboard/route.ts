import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-dynamic"
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
    const startOfLastMonth = startOfMonth(lastMonth);
    const startOfCurrentMonth = startOfMonth(currentMonth);

   // Get dashboard stats
   let dashboardStats = await prisma.dashboardStats.findFirst({
    where: { id: 1 },
  });



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
          AND: [
            {
              appointmentDateTime: { // Changed from createdAt to appointmentDateTime
                gte: startOfLastMonth,
                lt: startOfCurrentMonth,
              },
            },
            {
              status: { not: "CANCELLED" },
            }
          ]
        },
      })
    ]);
   
    const lastMonthRevenueValue = lastMonthRevenue._sum.fees || 0;



    // Update dashboardStats with the latest values
    dashboardStats = await prisma.dashboardStats.upsert({
      where: { id: 1 },
      update: {
        totalAppointments,
        totalRevenue: totalRevenue._sum.fees || 0,
        lastMonthRevenue: lastMonthRevenueValue
      },
      create: {
        id: 1,
        totalAppointments,
        totalRevenue: totalRevenue._sum.fees || 0,
        lastMonthRevenue: lastMonthRevenueValue
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

      
    // Calculate satisfaction rates
    const [currentMonthRatings, lastMonthRatings] = await Promise.all([
      prisma.rating.aggregate({
        _avg: {
          value: true,
        },
        where: {
          createdAt: {
            gte: startOfMonth(currentMonth),
          },
        },
      }),
      prisma.rating.aggregate({
        _avg: {
          value: true,
        },
        where: {
          createdAt: {
            gte: startOfMonth(lastMonth),
            lt: startOfMonth(currentMonth),
          },
        },
      }),
    ]);

    // Calculate satisfaction rates
    const satisfactionRate = currentMonthRatings._avg.value || 0;
    const lastMonthSatisfactionRate = lastMonthRatings._avg.value || 0;
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
        rate: satisfactionRate.toFixed(1),
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
