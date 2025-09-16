"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield, UserCheck } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  // SIEMPRE mostrar el dropdown, sin importar el estado de autenticación
  // Esto nos ayuda a debuggear el problema
  console.log('UserMenu - user:', user)
  console.log('UserMenu - isAuthenticated:', isAuthenticated)
  console.log('UserMenu - isOpen:', isOpen)

  // Mostrar dropdown para usuario no autenticado
  if (!user || !isAuthenticated) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-transparent">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">No autenticado</p>
              <p className="text-xs leading-none text-muted-foreground">
                Inicia sesión para acceder
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              console.log('Navigating to login...')
              router.push('/login')
            }}
            className="text-blue-600 focus:text-blue-600"
          >
            <User className="mr-2 h-4 w-4" />
            <span>Iniciar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "operator":
        return <UserCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador"
      case "operator":
        return "Operador"
      default:
        return "Usuario"
    }
  }

  // Usuario autenticado - mostrar dropdown completo
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-transparent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
            <AvatarFallback>
              {(user.name || user.email || "U").split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {getRoleIcon(user.role)}
              <span className="text-xs text-muted-foreground">
                {getRoleLabel(user.role)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => {
          console.log('Perfil clicked')
          // Aquí puedes agregar navegación al perfil en el futuro
        }}>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => {
          console.log('Configuración clicked')
          router.push('/settings')
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => {
            console.log('Cerrando sesión...')
            logout()
            setTimeout(() => {
              router.push('/login')
            }, 100)
          }}
          className="text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

