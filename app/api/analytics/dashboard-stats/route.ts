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

    // Obtener estadísticas
    const [totalTrucks, activeTrucks, totalCustomers, totalDispatchesToday] = await Promise.all([
      prisma.truck.count(),
      prisma.truck.count({
        where: { state: "Activo" },
      }),
      prisma.customer.count(),
      prisma.discharge.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
      }),
    ])

    return NextResponse.json({
      totalTrucks,
      activeTrucks,
      totalCustomers,
      totalDispatchesToday,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas del dashboard" }, { status: 500 })
  }
}
