import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { userSchema } from "@/lib/zod-schemas"

export async function GET(request: NextRequest) {
  const userId = getAuth()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const role = searchParams.get("role")
  const state = searchParams.get("state")

  // Build the where clause
  const where: any = {}
  if (role) {
    where.role = role
  }
  if (state) {
    where.state = state
  }

  try {
    const users = await prisma.user.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = userSchema.parse(body)

    // Create the user
    const user = await prisma.user.create({
      data: validatedData,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error creating user" }, { status: 400 })
  }
}
