"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Menu } from "lucide-react"
import { useState } from "react"
import { UserMenu } from "@/components/auth/user-menu"
import { useAuth } from "@/lib/contexts/auth-context"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="bg-card border-b border-border px-4 md:px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 md:space-x-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3 md:space-x-6">
            <h2 className="text-lg md:text-2xl font-bold text-foreground">
              <span className="hidden sm:inline">Sistema de Piscinas</span>
              <span className="sm:hidden">Piscinas</span>
            </h2>
            <Badge className="bg-primary text-primary-foreground text-xs">En línea</Badge>
          </div>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          {/* Desktop Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar piscinas..."
              className="pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring w-64"
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden bg-transparent"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative bg-transparent">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-4 w-4 md:h-5 md:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
              3
            </Badge>
          </Button>

          {/* User menu */}
          <UserMenu />
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar piscinas..."
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}
    </header>
  )
}
