import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function getUserRole() {
  const user = await currentUser()

  if (!user) {
    return null
  }

  return (user.publicMetadata.role as string) || "conductor"
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

export async function getAuth() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return userId
}
