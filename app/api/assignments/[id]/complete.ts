import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    // Get the assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        truck: true,
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Mark the assignment as completed
      const updatedAssignment = await tx.assignment.update({
        where: { id },
        data: { isCompleted: true },
      })

      // Update the truck state back to "Activo"
      await tx.truck.update({
        where: { id: assignment.truck.id },
        data: { state: "Activo" },
      })

      return updatedAssignment
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error completing assignment:", error)
    return NextResponse.json({ error: "Error completing assignment" }, { status: 500 })
  }
}
