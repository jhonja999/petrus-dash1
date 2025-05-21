import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { userSchema } from "@/lib/zod-schemas"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = userSchema.parse(body)

    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Error updating user" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    // Check if user has assignments
    const userHasAssignments = await prisma.assignment.findFirst({
      where: { driverId: id },
    })

    if (userHasAssignments) {
      return NextResponse.json({ error: "Cannot delete user with assignments" }, { status: 400 })
    }

    // Delete the user
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 })
  }
}
