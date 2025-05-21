import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { customerSchema } from "@/lib/zod-schemas"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getAuth()
  const id = Number.parseInt(params.id)

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Error fetching customer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = customerSchema.parse(body)

    // Update the customer
    const customer = await prisma.customer.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Error updating customer" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await requireAdmin()
  const id = Number.parseInt(params.id)

  try {
    // Check if customer has discharges
    const customerHasDischarges = await prisma.discharge.findFirst({
      where: { customerId: id },
    })

    if (customerHasDischarges) {
      return NextResponse.json({ error: "Cannot delete customer with discharge records" }, { status: 400 })
    }

    // Delete the customer
    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Error deleting customer" }, { status: 500 })
  }
}
