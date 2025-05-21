import { clerkClient } from "@clerk/nextjs/server"

export async function isAdmin(userId: string) {
  if (!userId) return false

  try {
    const user = await clerkClient.users.getUser(userId)
    return user.publicMetadata.role === "admin"
  } catch (error) {
    console.error("Error checking admin role:", error)
    return false
  }
}

export async function isDriver(userId: string) {
  if (!userId) return false

  try {
    const user = await clerkClient.users.getUser(userId)
    return user.publicMetadata.role === "conductor"
  } catch (error) {
    console.error("Error checking driver role:", error)
    return false
  }
}

export async function getUserRole(userId: string) {
  if (!userId) return null

  try {
    const user = await clerkClient.users.getUser(userId)
    return (user.publicMetadata.role as string) || "conductor"
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}
