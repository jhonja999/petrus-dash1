import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getDateRange } from "@/lib/date"

type FuelSummary = {
  fuelType: string
  total: number
}

export async function GET(request: NextRequest) {
  await requireAdmin()

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get("period") || "day"

  try {
    const { start, end } = getDateRange(period as any)

    // Traer todas las descargas con su tipo de combustible
    const discharges = await prisma.discharge.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        assignment: {
          select: {
            fuelType: true,
          },
        },
      },
    })

    // Agrupar en JS
    const fuelMap = new Map<string, number>()

    for (const discharge of discharges) {
      const type = discharge.assignment.fuelType
      const prev = fuelMap.get(type) || 0
      fuelMap.set(type, prev + Number(discharge.totalDischarged))
    }

    const formattedData: FuelSummary[] = Array.from(fuelMap.entries()).map(([fuelType, total]) => ({
      fuelType,
      total,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching fuel consumption:", error)
    return NextResponse.json({ error: "Error fetching fuel consumption" }, { status: 500 })
  }
}
