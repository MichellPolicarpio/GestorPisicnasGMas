"use client"

import { useState } from "react"
import { MobilePoolCard } from "@/components/pool/mobile-pool-card"
import { RealTimeStatus } from "@/components/pool/real-time-status"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, MapPin, BarChart3, Settings, Bell, Home, Activity, TrendingUp, AlertTriangle } from "lucide-react"

export default function MobilePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPool, setSelectedPool] = useState<string | null>(null)

  // Mock pool data - in production this would come from API
  const pools = ["pool-001", "pool-002", "pool-003"]

  const filteredPools = pools.filter((pool) => pool.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">Grupo Mas Agua</h1>
            <p className="text-xs text-muted-foreground">Sistema de Piscinas</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground text-xs">En línea</Badge>
            <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar piscinas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card className="p-3 text-center">
            <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold">127</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </Card>
          <Card className="p-3 text-center">
            <Activity className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold">89</p>
            <p className="text-xs text-muted-foreground">Activas</p>
          </Card>
          <Card className="p-3 text-center">
            <AlertTriangle className="h-4 w-4 text-destructive mx-auto mb-1" />
            <p className="text-lg font-bold">3</p>
            <p className="text-xs text-muted-foreground">Alertas</p>
          </Card>
          <Card className="p-3 text-center">
            <TrendingUp className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold">70%</p>
            <p className="text-xs text-muted-foreground">Eficiencia</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pools" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="pools" className="text-xs">
              Piscinas
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs">
              Monitoreo
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="space-y-3">
            {filteredPools.map((poolId) => (
              <MobilePoolCard key={poolId} poolId={poolId} />
            ))}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            {selectedPool ? (
              <RealTimeStatus poolId={selectedPool} />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground mb-4">Selecciona una piscina para monitorear</p>
                <div className="space-y-2">
                  {pools.slice(0, 3).map((poolId) => (
                    <Button
                      key={poolId}
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setSelectedPool(poolId)}
                    >
                      Piscina {poolId.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Resumen de Rendimiento</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Calidad del Agua</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-primary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eficiencia Energética</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-3/5 h-full bg-accent rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mantenimiento</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-5/6 h-full bg-secondary rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Tendencias Semanales</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Temperatura Promedio</p>
                  <p className="text-lg font-bold">26.2°C</p>
                  <p className="text-xs text-green-600">+0.5°C</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">pH Promedio</p>
                  <p className="text-lg font-bold">7.3</p>
                  <p className="text-xs text-green-600">Estable</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2">
        <div className="grid grid-cols-4 gap-1">
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
            <Home className="h-4 w-4" />
            <span className="text-xs">Inicio</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
            <MapPin className="h-4 w-4" />
            <span className="text-xs">Mapa</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Reportes</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 h-auto py-2">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Ajustes</span>
          </Button>
        </div>
      </div>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-16"></div>
    </div>
  )
}
