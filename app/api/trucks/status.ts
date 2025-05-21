import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const userId = getAuth()

  try {
    const body = await request.json()
    const { truckId, newState } = body

    if (!truckId || !newState) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update the truck state
    const truck = await prisma.truck.update({
      where: { id: truckId },
      data: { state: newState },
    })

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error updating truck status:", error)
    return NextResponse.json({ error: "Error updating truck status" }, { status: 500 })
  }
}
