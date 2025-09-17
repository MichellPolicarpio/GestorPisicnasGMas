"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  MapPin,
  Home,
  Settings,
  Droplets,
  Menu,
  X,
  CheckCircle,
  Zap,
  Plus,
  FileText,
  BarChart3,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Mapa de Piscinas", href: "/pools", icon: MapPin },
  { name: "Estatus de Piscinas", href: "/pool-status", icon: CheckCircle },
  { name: "Agregar Piscina", href: "/add-pool", icon: Plus },
  { name: "Modalidad de Consumo", href: "/consumption", icon: Zap },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border-border"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:inset-0 md:translate-x-0",
          isCollapsed ? "md:w-20" : "md:w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex w-full items-center py-4",
              isCollapsed ? "px-4 md:justify-center md:px-4" : "px-6 md:px-6",
            )}
          >
            {!isCollapsed && (
              <div className="flex items-center">
                <Droplets className="mr-3 h-8 w-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-sidebar-foreground">Grupo Mas Agua</span>
                  <span className="text-sm text-muted-foreground">Veracruz</span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "hidden bg-card border-border md:flex",
                !isCollapsed && "ml-auto",
              )}
              onClick={() => setIsCollapsed((prev) => !prev)}
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className={cn("px-4 py-6 space-y-2", isCollapsed && "md:px-2")}>
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed && "md:justify-center md:px-2",
                          isActive
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <Icon
                          className={cn("h-4 w-4 mr-3", isCollapsed && "md:mr-0")}
                        />
                        <span className={cn(isCollapsed && "md:hidden")}>{item.name}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </nav>

          {/* Quick Stats - Posicionado después de navegación */}
          {!isCollapsed && (
            <>
              <div className="px-4 mb-4">
                <Card className="p-3">
                  <h4 className="mb-2 text-sm font-medium text-card-foreground">Resumen Rápido</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Piscinas totales:</span>
                      <span className="font-medium">1,395</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revisadas:</span>
                      <span className="font-medium text-primary">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">No Revisadas:</span>
                      <span className="font-medium text-destructive">1,395</span>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* Sistema Info - Justo debajo del resumen */}
          {!isCollapsed && (
            <div className="px-4 mb-4">
              <Card className="p-3">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Sistema v1.0</p>
                  <p>Última actualización: Hoy</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
