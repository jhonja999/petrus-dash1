import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getDateRange } from "@/lib/date"

export async function GET(request: NextRequest) {
  await requireAdmin()

  try {
    const { start, end } = getDateRange("day")

    // Get counts
    const [trucksCount, activeDrivers, customersCount, todayAssignments, totalFuelToday, trucksByState] =
      await Promise.all([
        prisma.truck.count(),
        prisma.user.count({
          where: {
            role: "Conductor",
            state: "Activo",
          },
        }),
        prisma.customer.count(),
        prisma.assignment.count({
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
        }),
        prisma.discharge.aggregate({
          _sum: {
            totalDischarged: true,
          },
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        }),
        prisma.truck.groupBy({
          by: ["state"],
          _count: {
            id: true,
          },
        }),
      ])

    // Format truck states for chart
    const truckStateData = trucksByState.map((item) => ({
      state: item.state,
      count: item._count.id,
    }))

    return NextResponse.json({
      trucksCount,
      activeDrivers,
      customersCount,
      todayAssignments,
      totalFuelToday: totalFuelToday._sum.totalDischarged || 0,
      truckStateData,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error fetching dashboard stats" }, { status: 500 })
  }
}
