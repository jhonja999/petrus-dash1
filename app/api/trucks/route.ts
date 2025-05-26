import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { truckSchema } from "@/lib/zod-schemas"
import type { Prisma } from "@prisma/client"
import z from "zod"

export async function GET(request: NextRequest) {
  const userId = getAuth()

  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get("state")

  // Build the where clause
  const where: Prisma.TruckWhereInput = {}
  if (state) {
    where.state = state as "Activo" | "Inactivo" | "Mantenimiento" | "Transito" | "Descarga" | "Asignado"
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
    // ✅ Validar con Zod
    const data = truckSchema.parse(body)

    const truck = await prisma.truck.create({
      data: {
        placa: data.placa,
        typefuel: data.typefuel,
        capacitygal: data.capacitygal,
        state: data.state ?? "Activo",
        brand: data.brand ?? null,
        model: data.model ?? null,
        year: data.year ?? null,
        engineNumber: data.engineNumber ?? null,
        chassisNumber: data.chassisNumber ?? null,
        color: data.color ?? null,
        mileage: data.mileage ?? null,
        maxWeight: data.maxWeight ?? null,
        lastMaintenance: data.lastMaintenance ?? null,
        nextMaintenance: data.nextMaintenance ?? null,
        maintenanceKm: data.maintenanceKm ?? null,
        insuranceCompany: data.insuranceCompany ?? null,
        insurancePolicy: data.insurancePolicy ?? null,
        insuranceExpiry: data.insuranceExpiry ?? null,
        notes: data.notes ?? null,
      },
    })

    return Response.json(truck, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "Validación fallida",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      )
    }

    console.error("Error creating truck:", error)
    return Response.json({ error: "Error al crear camión" }, { status: 500 })
  }
}