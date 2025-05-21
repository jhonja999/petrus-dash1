import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { truckSchema } from "@/lib/zod-schemas"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const truck = await prisma.truck.findUnique({
      where: { id },
    })

    if (!truck) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error fetching truck:", error)
    return NextResponse.json({ error: "Error fetching truck" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = truckSchema.parse(body)

    // Update the truck
    const truck = await prisma.truck.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error updating truck:", error)
    return NextResponse.json({ error: "Error updating truck" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    // Check if truck has assignments
    const truckHasAssignments = await prisma.assignment.findFirst({
      where: { truckId: id },
    })

    if (truckHasAssignments) {
      return NextResponse.json({ error: "Cannot delete truck with assignments" }, { status: 400 })
    }

    // Delete the truck
    await prisma.truck.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting truck:", error)
    return NextResponse.json({ error: "Error deleting truck" }, { status: 500 })
  }
}
