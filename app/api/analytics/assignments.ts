import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getDateRange } from "@/lib/date"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type AssignmentAnalytics = {
  period: string
  count: number
}

export async function GET(request: NextRequest) {
  await requireAdmin()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "day"

  try {
    const { start, end } = getDateRange(period as any)

    // Get assignments by period
    let assignments
     let formattedData: AssignmentAnalytics[] = []

    if (period === "day") {
      // Group by hour
      assignments = await prisma.assignment.groupBy({
        by: ["date"],
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "asc",
        },
      })

      formattedData = assignments.map((item) => ({
        period: format(item.date, "HH:mm", { locale: es }),
        count: item._count.id,
      }))
    } else if (period === "week") {
      // Group by day of week
      assignments = await prisma.assignment.groupBy({
        by: ["date"],
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "asc",
        },
      })

      formattedData = assignments.map((item) => ({
        period: format(item.date, "EEEE", { locale: es }),
        count: item._count.id,
      }))
    } else if (period === "month") {
      // Group by day of month
      assignments = await prisma.assignment.groupBy({
        by: ["date"],
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "asc",
        },
      })

      formattedData = assignments.map((item) => ({
        period: format(item.date, "dd MMM", { locale: es }),
        count: item._count.id,
      }))
    } else if (period === "year") {
      // Group by month
      assignments = await prisma.assignment.groupBy({
        by: ["date"],
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          date: "asc",
        },
      })

      formattedData = assignments.map((item) => ({
        period: format(item.date, "MMMM", { locale: es }),
        count: item._count.id,
      }))
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching assignments data:", error)
    return NextResponse.json({ error: "Error fetching assignments data" }, { status: 500 })
  }
}
