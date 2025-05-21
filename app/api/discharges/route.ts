import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { dischargeSchema } from "@/lib/zod-schemas"

export async function POST(request: NextRequest) {
  const userId = getAuth()

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = dischargeSchema.parse(body)
    const { assignmentId, customerId, startMarker, endMarker, notes } = validatedData

    // Calculate the total discharged
    const totalDischarged = endMarker - startMarker

    if (totalDischarged <= 0) {
      return NextResponse.json({ error: "End marker must be greater than start marker" }, { status: 400 })
    }

    // Get the current assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Check if there's enough fuel remaining
    if (Number(assignment.totalRemaining) < totalDischarged) {
      return NextResponse.json({ error: "Not enough fuel remaining for this discharge" }, { status: 400 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update the discharge record
      const discharge = await tx.discharge.update({
        where: {
          assignmentId_customerId: {
            assignmentId,
            customerId,
          },
        },
        data: {
          totalDischarged,
          startMarker,
          endMarker,
          notes,
        },
      })

      // Update the assignment's remaining fuel
      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          totalRemaining: {
            decrement: totalDischarged,
          },
        },
        include: {
          discharges: true,
        },
      })

      // Check if all discharges are completed
      const allCompleted = updatedAssignment.discharges.every((d) => Number(d.totalDischarged) > 0)

      // If all discharges are completed, mark the assignment as completed
      if (allCompleted) {
        await tx.assignment.update({
          where: { id: assignmentId },
          data: { isCompleted: true },
        })

        // Update the truck state back to "Activo"
        await tx.truck.update({
          where: { id: updatedAssignment.truckId },
          data: { state: "Activo" },
        })
      }

      return { discharge, updatedAssignment }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error recording discharge:", error)
    return NextResponse.json({ error: "Error recording discharge" }, { status: 400 })
  }
}
