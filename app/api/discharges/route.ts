import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { dischargeSchema } from "@/lib/zod-schemas"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar datos con Zod
    const validatedData = dischargeSchema.parse(body)

    // Verificar si la asignación existe
    const assignment = await prisma.assignment.findUnique({
      where: { id: validatedData.assignmentId },
      include: { truck: true },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Asignación no encontrada" }, { status: 404 })
    }

    // Verificar si el cliente existe
    const customer = await prisma.customer.findUnique({
      where: { id: validatedData.customerId },
    })

    if (!customer) {
      return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 })
    }

    // Verificar que la descarga no exceda el combustible restante
    if (validatedData.totalDischarged > assignment.totalRemaining) {
      return NextResponse.json({ error: "La descarga excede el combustible restante" }, { status: 400 })
    }

    // Actualizar estado del camión a "Descarga"
    await prisma.truck.update({
      where: { id: assignment.truck.id },
      data: { state: "Descarga" },
    })

    // Crear descarga
    const discharge = await prisma.discharge.create({
      data: validatedData,
    })

    // Actualizar combustible restante en la asignación
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: {
        totalRemaining: {
          decrement: validatedData.totalDischarged,
        },
      },
    })

    // Restaurar estado del camión a "Asignado"
    await prisma.truck.update({
      where: { id: assignment.truck.id },
      data: { state: "Asignado" },
    })

    return NextResponse.json(discharge, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    console.error("Error creating discharge:", error)
    return NextResponse.json({ error: "Error al crear descarga" }, { status: 500 })
  }
}
