import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        truck: true,
        driver: true,
        discharges: {
          include: {
            customer: true,
          },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    return NextResponse.json(assignment)
  } catch (error) {
    console.error("Error fetching assignment:", error)
    return NextResponse.json({ error: "Error fetching assignment" }, { status: 500 })
  }
}
