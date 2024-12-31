import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { startOfMonth, subMonths, startOfYesterday, endOfYesterday } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current and last month dates
    const currentMonth = new Date()
    const lastMonth = subMonths(currentMonth, 1)
    const yesterday = startOfYesterday()
    const yesterdayEnd = endOfYesterday()

    // Get total patients (unique users with appointments)
    const [currentMonthPatients, lastMonthPatients] = await Promise.all([
      prisma.appointment.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startOfMonth(currentMonth),
          },
        },
      }),
      prisma.appointment.groupBy({
        by: ['userId'],
        where: {
          createdAt: {
            gte: startOfMonth(lastMonth),
            lt: startOfMonth(currentMonth),
          },
        },
      }),
    ])

    // Get appointments count
    const [totalAppointments, yesterdayAppointments] = await Promise.all([
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          createdAt: {
            gte: yesterday,
            lte: yesterdayEnd,
          },
        },
      }),
    ])

    // Calculate revenue
    const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
      prisma.appointment.aggregate({
        _sum: {
          fees: true,
        },
        where: {
          createdAt: {
            gte: startOfMonth(currentMonth),
          },
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
        },
      }),
    ])

    // Calculate patient satisfaction (this would typically come from a ratings table)
    // For this example, we'll use a mock calculation
    const satisfactionRate = 98.2
    const lastMonthSatisfactionRate = 96.1

    // Calculate percentage changes
    const patientChange = ((currentMonthPatients.length - lastMonthPatients.length) / lastMonthPatients.length) * 100
    const revenueChange = ((currentMonthRevenue._sum.fees || 0) - (lastMonthRevenue._sum.fees || 0)) / (lastMonthRevenue._sum.fees || 1) * 100
    const satisfactionChange = satisfactionRate - lastMonthSatisfactionRate

    return NextResponse.json({
      totalPatients: {
        count: currentMonthPatients.length,
        change: patientChange.toFixed(1),
      },
      appointments: {
        count: totalAppointments,
        change: yesterdayAppointments,
      },
      revenue: {
        amount: currentMonthRevenue._sum.fees || 0,
        change: revenueChange.toFixed(1),
      },
      satisfaction: {
        rate: satisfactionRate,
        change: satisfactionChange.toFixed(1),
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

