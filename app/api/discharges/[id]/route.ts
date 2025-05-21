import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const discharge = await prisma.discharge.findUnique({
      where: { id },
      include: {
        assignment: true,
        customer: true,
      },
    })

    if (!discharge) {
      return NextResponse.json({ error: "Discharge not found" }, { status: 404 })
    }

    return NextResponse.json(discharge)
  } catch (error) {
    console.error("Error fetching discharge:", error)
    return NextResponse.json({ error: "Error fetching discharge" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const body = await request.json()
    const { startMarker, endMarker, notes } = body

    // Validate input
    if (endMarker <= startMarker) {
      return NextResponse.json({ error: "End marker must be greater than start marker" }, { status: 400 })
    }

    // Calculate the total discharged
    const totalDischarged = endMarker - startMarker

    // Get the current discharge
    const discharge = await prisma.discharge.findUnique({
      where: { id },
      include: {
        assignment: true,
      },
    })

    if (!discharge) {
      return NextResponse.json({ error: "Discharge not found" }, { status: 404 })
    }

    // If the discharge already has a value, calculate the difference
    const currentDischarged = Number(discharge.totalDischarged) || 0
    const dischargeDifference = totalDischarged - currentDischarged

    // Check if there's enough fuel remaining in the assignment
    if (dischargeDifference > 0 && Number(discharge.assignment.totalRemaining) < dischargeDifference) {
      return NextResponse.json({ error: "Not enough fuel remaining for this discharge" }, { status: 400 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the discharge record
      const updatedDischarge = await tx.discharge.update({
        where: { id },
        data: {
          totalDischarged,
          startMarker,
          endMarker,
          notes,
        },
      })

      // Update the assignment's remaining fuel
      const updatedAssignment = await tx.assignment.update({
        where: { id: discharge.assignmentId },
        data: {
          totalRemaining: {
            decrement: dischargeDifference,
          },
        },
        include: {
          discharges: true,
        },
      })

      return { updatedDischarge, updatedAssignment }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating discharge:", error)
    return NextResponse.json({ error: "Error updating discharge" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    // Get the discharge to check if it has fuel discharged
    const discharge = await prisma.discharge.findUnique({
      where: { id },
    })

    if (!discharge) {
      return NextResponse.json({ error: "Discharge not found" }, { status: 404 })
    }

    // If the discharge has fuel, don't allow deletion
    if (Number(discharge.totalDischarged) > 0) {
      return NextResponse.json({ error: "Cannot delete a discharge that has already been completed" }, { status: 400 })
    }

    // Delete the discharge
    await prisma.discharge.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting discharge:", error)
    return NextResponse.json({ error: "Error deleting discharge" }, { status: 500 })
  }
}
