import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { truckSchema } from "@/lib/zod-schemas"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state")

    const where = {
      ...(state ? { state: state as any } : {}),
    }

    const trucks = await prisma.truck.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(trucks)
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Error al obtener camiones" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar datos con Zod
    const validatedData = truckSchema.parse(body)

    // Verificar si la placa ya existe
    const existingTruck = await prisma.truck.findUnique({
      where: { placa: validatedData.placa },
    })

    if (existingTruck) {
      return NextResponse.json({ error: "La placa ya está registrada" }, { status: 400 })
    }

    // Crear camión
    const truck = await prisma.truck.create({
      data: validatedData,
    })

    return NextResponse.json(truck, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    console.error("Error creating truck:", error)
    return NextResponse.json({ error: "Error al crear camión" }, { status: 500 })
  }
}
