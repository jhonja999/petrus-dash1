import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getDateRange } from "@/lib/date"

export async function GET(request: NextRequest) {
  await requireAdmin()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "day"

  try {
    const { start, end } = getDateRange(period as any)

    // Get fuel consumption by type
    const fuelConsumption = await prisma.discharge.groupBy({
      by: ["assignment.fuelType"],
      _sum: {
        totalDischarged: true,
      },
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        _sum: {
          totalDischarged: "desc",
        },
      },
    })

    // Format data for chart
    const formattedData = fuelConsumption.map((item) => ({
      fuelType: item.fuelType,
      total: Number(item._sum.totalDischarged) || 0,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching fuel consumption:", error)
    return NextResponse.json({ error: "Error fetching fuel consumption" }, { status: 500 })
  }
}
