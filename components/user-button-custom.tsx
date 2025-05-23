"use client"

import { useUser } from "@clerk/nextjs"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserButtonCustom() {
  const { user } = useUser()

  if (!user) return null

  const userRole = user.publicMetadata?.role as string
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()

  const handleSignOut = () => {
    window.location.href = "/sign-in"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.fullName || ""} />
            <AvatarFallback className="bg-emerald-600 text-white text-sm">
              {initials || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user.fullName || user.emailAddresses[0]?.emailAddress}</span>
            <span className="text-xs text-muted-foreground capitalize">{userRole || "Usuario"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
