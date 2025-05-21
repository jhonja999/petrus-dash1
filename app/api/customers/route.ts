import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { customerSchema } from "@/lib/zod-schemas"

export async function GET() {
  const userId = getAuth()

  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        companyname: "asc",
      },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Error fetching customers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = customerSchema.parse(body)

    // Create the customer
    const customer = await prisma.customer.create({
      data: validatedData,
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error("Error creating customer:", error)
    return NextResponse.json({ error: "Error creating customer" }, { status: 400 })
  }
}
