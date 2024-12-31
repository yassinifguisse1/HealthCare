import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the last 7 months
    const months = Array.from({ length: 7 }).map((_, i) => {
      const date = subMonths(new Date(), i)
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        name: format(date, 'MMM')
      }
    }).reverse()

    // Fetch appointment counts per month
    const appointmentCounts = await Promise.all(
      months.map(async ({ start, end }) => {
        return await prisma.appointment.count({
          where: {
            appointmentDateTime: {
              gte: start,
              lte: end
            }
          }
        })
      })
    )

    // Fetch revenue per month
    const revenue = await Promise.all(
      months.map(async ({ start, end }) => {
        const result = await prisma.appointment.aggregate({
          where: {
            appointmentDateTime: {
              gte: start,
              lte: end
            }
          },
          _sum: {
            fees: true
          }
        })
        return {
          month: format(start, 'MMM'),
          revenue: result._sum.fees || 0
        }
      })
    )

    return NextResponse.json({
      appointments: months.map((month, i) => ({
        name: month.name,
        appointments: appointmentCounts[i]
      })),
      revenue: revenue
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

