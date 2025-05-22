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

    // Validate the truck exists
    const truck = await prisma.truck.findUnique({
      where: { id: truckId },
    })

    if (!truck) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    // Validate the state is valid
    const validStates = ["Activo", "Inactivo", "Mantenimiento", "Transito", "Descarga", "Asignado"]
    if (!validStates.includes(newState)) {
      return NextResponse.json({ error: "Invalid state" }, { status: 400 })
    }

    // Update the truck state
    const updatedTruck = await prisma.truck.update({
      where: { id: truckId },
      data: { state: newState },
    })

    return NextResponse.json(updatedTruck)
  } catch (error) {
    console.error("Error updating truck status:", error)
    return NextResponse.json({ error: "Error updating truck status" }, { status: 500 })
  }
}
