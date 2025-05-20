import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { userSchema } from "@/lib/zod-schemas"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role")
    const state = searchParams.get("state")

    const where = {
      ...(role ? { role: role as any } : {}),
      ...(state ? { state: state as any } : {}),
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validar datos con Zod
    const validatedData = userSchema.parse(body)

    // Verificar si el DNI o email ya existen
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ dni: validatedData.dni }, { email: validatedData.email }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El DNI o email ya están registrados" }, { status: 400 })
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: validatedData,
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
