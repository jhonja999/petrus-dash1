import { type NextRequest, NextResponse } from "next/server"
import { getAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { dischargeSchema } from "@/lib/zod-schemas"

export async function POST(request: NextRequest) {
  const userId = getAuth()

  try {
    const body = await request.json()

    // Validar el cuerpo de la solicitud
    const validatedData = dischargeSchema.parse(body)
    const { assignmentId, customerId, startMarker, endMarker, notes } = validatedData

    const totalDischarged = endMarker - startMarker

    if (totalDischarged <= 0) {
      return NextResponse.json({ error: "End marker must be greater than start marker" }, { status: 400 })
    }

    // Verificar asignación
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    })

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 })
    }

    // Validar combustible disponible
    if (Number(assignment.totalRemaining) < totalDischarged) {
      return NextResponse.json({ error: "Not enough fuel remaining for this discharge" }, { status: 400 })
    }

    // Iniciar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Buscar descarga previa (opcional)
      const existingDischarge = await tx.discharge.findFirst({
        where: {
          assignmentId,
          customerId,
        },
      })

      let discharge

      if (existingDischarge && Number(existingDischarge.totalDischarged) === 0) {
        // Actualizar si existe y no se ha descargado aún
        discharge = await tx.discharge.update({
          where: { id: existingDischarge.id },
          data: {
            totalDischarged,
            startMarker,
            endMarker,
            notes,
          },
        })
      } else {
        // Crear nueva descarga si no hay previa válida
        discharge = await tx.discharge.create({
          data: {
            assignmentId,
            customerId,
            totalDischarged,
            startMarker,
            endMarker,
            notes,
          },
        })
      }

      // Restar galones a la asignación
      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          totalRemaining: {
            decrement: totalDischarged,
          },
        },
        include: {
          discharges: true,
        },
      })

      const allCompleted = updatedAssignment.discharges.every(
        (d) => Number(d.totalDischarged) > 0
      )

      if (allCompleted) {
        await tx.assignment.update({
          where: { id: assignmentId },
          data: { isCompleted: true },
        })

        await tx.truck.update({
          where: { id: updatedAssignment.truckId },
          data: { state: "Activo" },
        })
      }

      return { discharge, updatedAssignment }
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error recording discharge:", error)
    return NextResponse.json({ error: "Error recording discharge" }, { status: 400 })
  }
}
