import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { truckSchema } from "@/lib/zod-schemas"

export async function GET(request: NextRequest) {
  const userId = getAuth()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get("state")

  // Build the where clause
  const where: any = {}
  if (state) {
    where.state = state
  }

  try {
    const trucks = await prisma.truck.findMany({
      where,
      orderBy: {
        placa: "asc",
      },
    })

    return NextResponse.json(trucks)
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Error fetching trucks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = truckSchema.parse(body)

    // Create the truck
    const truck = await prisma.truck.create({
      data: validatedData,
    })

    return NextResponse.json(truck, { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ error: "Error creating truck" }, { status: 400 })
  }
}
