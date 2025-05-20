import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { userSchema } from "@/lib/zod-schemas"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await req.json()

    // Validar datos con Zod
    const validatedData = userSchema.parse(body)

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Verificar si el DNI o email ya existen en otro usuario
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [{ dni: validatedData.dni }, { email: validatedData.email }],
        NOT: { id },
      },
    })

    if (duplicateUser) {
      return NextResponse.json({ error: "El DNI o email ya están registrados por otro usuario" }, { status: 400 })
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar usuario (cambiar estado a Eliminado)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { state: "Eliminado" },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
