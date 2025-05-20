import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "today"

    // Calcular fechas según el período
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "week":
        const day = now.getDay() || 7
        startDate = new Date(now)
        startDate.setDate(now.getDate() - day + 1)
        startDate.setHours(0, 0, 0, 0)
        break
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    // Obtener consumo de combustible por tipo
    const discharges = await prisma.discharge.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
      },
      include: {
        assignment: true,
      },
    })

    // Agrupar por tipo de combustible
    const fuelConsumption = discharges.reduce(
      (acc, discharge) => {
        const fuelType = discharge.assignment.fuelType
        const amount = Number(discharge.totalDischarged)

        if (!acc[fuelType]) {
          acc[fuelType] = 0
        }

        acc[fuelType] += amount

        return acc
      },
      {} as Record<string, number>,
    )

    // Transformar a formato para gráfico
    const result = Object.entries(fuelConsumption).map(([name, total]) => ({
      name,
      total,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching fuel consumption:", error)
    return NextResponse.json({ error: "Error al obtener consumo de combustible" }, { status: 500 })
  }
}
