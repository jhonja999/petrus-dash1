// app/api/users/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getAuth, requireAdmin } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { userSchema } from "@/lib/zod-schemas"
import type { Prisma } from "@prisma/client"
import { ZodError } from "zod"

export async function GET(request: NextRequest) {
  const userId = getAuth()

  const searchParams = request.nextUrl.searchParams
  const role = searchParams.get("role") as Prisma.UserWhereInput["role"]
  const state = searchParams.get("state") as Prisma.UserWhereInput["state"]

  const where: Prisma.UserWhereInput = {}
  if (role) where.role = role
  if (state) where.state = state

  try {
    const users = await prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await requireAdmin()

  try {
    const body = await request.json()
    const validatedData = userSchema.parse(body)

    const userData: Prisma.UserCreateInput = {
      dni: validatedData.dni,
      name: validatedData.name,
      lastname: validatedData.lastname,
      email: validatedData.email,
      role: validatedData.role,
      state: validatedData.state ?? "Activo",
    }

    // Only add optional fields if defined
    if (validatedData.licenseNumber !== undefined) {
      userData.licenseNumber = validatedData.licenseNumber
    }
    if (validatedData.licenseType !== undefined) {
      userData.licenseType = validatedData.licenseType
    }
    if (validatedData.licenseExpiry) {
      userData.licenseExpiry = validatedData.licenseExpiry
    }
    if (validatedData.phone !== undefined) {
      userData.phone = validatedData.phone
    }
    if (validatedData.address !== undefined) {
      userData.address = validatedData.address
    }
    if (validatedData.emergencyContact !== undefined) {
      userData.emergencyContact = validatedData.emergencyContact
    }
    if (validatedData.emergencyPhone !== undefined) {
      userData.emergencyPhone = validatedData.emergencyPhone
    }

    const user = await prisma.user.create({ data: userData })
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Error de validación", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Error creando usuario", details: error instanceof Error ? error.message : undefined },
      { status: 400 }
    )
  }
}
