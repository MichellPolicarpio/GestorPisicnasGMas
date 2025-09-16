"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Home, BarChart3, Settings, Users, Droplets, Menu, X, FileText, CheckCircle, Building2, Zap, Plus } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Mapa de Piscinas", href: "/pools", icon: MapPin },
  { name: "Estatus de Piscinas", href: "/pool-status", icon: CheckCircle },
  { name: "Agregar Piscina", href: "/add-pool", icon: Plus },
  { name: "Propietarios", href: "/owners", icon: Building2 },
  { name: "Modalidad de Consumo", href: "/consumption", icon: Zap },
  { name: "Reportes", href: "/reports", icon: BarChart3 },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-sidebar-border">
            <Droplets className="h-8 w-8 text-primary mr-3" />
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Grupo MAs Agua</h1>
              <p className="text-sm text-muted-foreground">Veracruz</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Quick Stats - Posicionado después de navegación */}
          <div className="px-4 mb-4">
            <Card className="p-3">
              <h4 className="text-sm font-medium mb-2 text-card-foreground">Resumen Rápido</h4>
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

          {/* Sistema Info - Justo debajo del resumen */}
          <div className="px-4 mb-4">
            <Card className="p-3">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Sistema v1.0</p>
                <p>Última actualización: Hoy</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

