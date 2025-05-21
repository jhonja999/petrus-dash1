import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  await requireAdmin()

  try {
    // Get trucks by state
    const trucksByState = await prisma.truck.groupBy({
      by: ["state"],
      _count: {
        id: true,
      },
    })

    // Format data for chart
    const formattedData = trucksByState.map((item) => ({
      state: item.state,
      count: item._count.id,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching trucks status:", error)
    return NextResponse.json({ error: "Error fetching trucks status" }, { status: 500 })
  }
}
