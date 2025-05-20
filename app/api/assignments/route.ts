import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { assignmentSchema } from "@/lib/zod-schemas"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const driverId = searchParams.get("driverId")
    const truckId = searchParams.get("truckId")
    const date = searchParams.get("date")

    const where = {
      ...(driverId ? { driverId: Number.parseInt(driverId) } : {}),
      ...(truckId ? { truckId: Number.parseInt(truckId) } : {}),
      ...(date
        ? {
            createdAt: {
              gte: new Date(`${date}T00:00:00Z`),
              lt: new Date(`${date}T23:59:59Z`),
            },
          }
        : {}),
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        truck: true,
        driver: true,
        discharges: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Transformar los datos para incluir la lista de clientes
    const transformedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        // Obtener los clientes asignados a esta asignación
        // En un sistema real, esto podría ser una relación directa en la base de datos
        const customers = await prisma.customer.findMany({
          where: {
            // Filtro según la lógica de negocio
          },
        })

        // Determinar qué clientes ya han sido atendidos
        const dischargedCustomerIds = assignment.discharges.map((d) => d.customerId)

        return {
          ...assignment,
          customers: customers.map((customer) => ({
            ...customer,
            discharged: dischargedCustomerIds.includes(customer.id),
          })),
        }
      }),
    )

    return NextResponse.json(transformedAssignments)
  } catch (error) {
    console.error("Error fetching assignments:", error)
    return NextResponse.json({ error: "Error al obtener asignaciones" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar datos con Zod
    const validatedData = assignmentSchema.parse(body)

    // Verificar si el camión existe y está disponible
    const truck = await prisma.truck.findUnique({
      where: { id: validatedData.truckId },
    })

    if (!truck) {
      return NextResponse.json({ error: "Camión no encontrado" }, { status: 404 })
    }

    if (truck.state !== "Activo") {
      return NextResponse.json({ error: "El camión no está disponible" }, { status: 400 })
    }

    // Verificar si el conductor existe y está disponible
    const driver = await prisma.user.findUnique({
      where: { id: validatedData.driverId },
    })

    if (!driver) {
      return NextResponse.json({ error: "Conductor no encontrado" }, { status: 404 })
    }

    if (driver.state !== "Activo") {
      return NextResponse.json({ error: "El conductor no está disponible" }, { status: 400 })
    }

    // Verificar que la carga no exceda la capacidad del camión
    if (validatedData.totalLoaded > truck.capacitygal) {
      return NextResponse.json({ error: "La carga excede la capacidad del camión" }, { status: 400 })
    }

    // Crear asignación
    const assignment = await prisma.assignment.create({
      data: validatedData,
    })

    // Actualizar estado del camión y conductor
    await prisma.truck.update({
      where: { id: truck.id },
      data: { state: "Asignado" },
    })

    await prisma.user.update({
      where: { id: driver.id },
      data: { state: "Asignado" },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    console.error("Error creating assignment:", error)
    return NextResponse.json({ error: "Error al crear asignación" }, { status: 500 })
  }
}
