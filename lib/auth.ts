import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { UserRole } from "@/types/globals"

export async function getUserRole(): Promise<UserRole | null> {
  const user = await currentUser()

  if (!user) return null

  const role = user.publicMetadata?.role as UserRole | undefined

  return role || null
}

export async function requireAdmin() {
  const role = await getUserRole()

  if (role !== "admin") {
    redirect("/unauthorized")
  }
}

export async function requireDriver() {
  const role = await getUserRole()

  if (role !== "conductor" && role !== "admin") {
    redirect("/unauthorized")
  }
}

export async function getAuth(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return userId
}
