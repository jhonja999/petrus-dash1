import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { assignmentSchema } from "@/lib/zod-schemas"

export async function GET() {
  const userId = getAuth()

  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        truck: true,
        driver: true,
        discharges: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Error fetching assignments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = assignmentSchema.parse(body)
    const { customers, ...assignmentData } = validatedData

    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the assignment
      const assignment = await tx.assignment.create({
        data: {
          ...assignmentData,
          totalRemaining: assignmentData.totalLoaded,
          date: new Date(),
        },
      })

      // Create discharge records for each customer
      const discharges = await Promise.all(
        customers.map((customerId) =>
          tx.discharge.create({
            data: {
              assignmentId: assignment.id,
              customerId,
              totalDischarged: 0,
              startMarker: 0,
              endMarker: 0,
            },
          }),
        ),
      )

      // Update the truck state to "Asignado"
      await tx.truck.update({
        where: { id: assignmentData.truckId },
        data: { state: "Asignado" },
      })

      return { assignment, discharges }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Error creating assignment" }, { status: 400 })
  }
}
