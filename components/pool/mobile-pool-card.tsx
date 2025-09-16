"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Activity, Zap, Settings, Eye } from "lucide-react"
import { usePoolData } from "@/lib/hooks/use-pool-data"
import Link from "next/link"

interface MobilePoolCardProps {
  poolId: string
}

export function MobilePoolCard({ poolId }: MobilePoolCardProps) {
  const { data, loading, connected } = usePoolData({ poolId })

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!data) return null

  const { pool, currentSensors, equipment, alerts } = data

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return "default"
    return "destructive"
  }

  const criticalAlerts = alerts.filter((alert) => alert.priority === "critical" || alert.priority === "high")

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{pool.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{pool.address}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
          <Badge variant={pool.status === "active" ? "default" : "secondary"} className="text-xs">
            {pool.status === "active" ? "Activa" : "Mantenimiento"}
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2">
          <p className="text-xs font-medium text-destructive">
            {criticalAlerts.length} alerta{criticalAlerts.length > 1 ? "s" : ""} crítica
            {criticalAlerts.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-destructive/80 truncate">{criticalAlerts[0].message}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Thermometer className="h-3 w-3 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Temp</p>
            <p className="text-sm font-semibold truncate">{currentSensors.temperature.toFixed(1)}°C</p>
          </div>
          <Badge variant={getStatusColor(currentSensors.temperature, 24, 28)} className="text-xs px-1">
            {currentSensors.temperature >= 24 && currentSensors.temperature <= 28 ? "OK" : "!"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Droplets className="h-3 w-3 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">pH</p>
            <p className="text-sm font-semibold truncate">{currentSensors.ph.toFixed(1)}</p>
          </div>
          <Badge variant={getStatusColor(currentSensors.ph, 7.0, 7.6)} className="text-xs px-1">
            {currentSensors.ph >= 7.0 && currentSensors.ph <= 7.6 ? "OK" : "!"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Activity className="h-3 w-3 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Cloro</p>
            <p className="text-sm font-semibold truncate">{currentSensors.chlorine.toFixed(1)} ppm</p>
          </div>
          <Badge variant={getStatusColor(currentSensors.chlorine, 1.0, 3.0)} className="text-xs px-1">
            {currentSensors.chlorine >= 1.0 && currentSensors.chlorine <= 3.0 ? "OK" : "!"}
          </Badge>
        </div>

        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Zap className="h-3 w-3 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Turbidez</p>
            <p className="text-sm font-semibold truncate">{currentSensors.turbidity.toFixed(1)} NTU</p>
          </div>
          <Badge variant={currentSensors.turbidity <= 1.0 ? "default" : "destructive"} className="text-xs px-1">
            {currentSensors.turbidity <= 1.0 ? "OK" : "!"}
          </Badge>
        </div>
      </div>

      {/* Equipment Status */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Equipo:</span>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${equipment.pumpStatus ? "bg-green-500" : "bg-gray-400"}`} />
            <div className={`w-2 h-2 rounded-full ${equipment.heaterStatus ? "bg-orange-500" : "bg-gray-400"}`} />
            <div className={`w-2 h-2 rounded-full ${equipment.lightStatus ? "bg-yellow-500" : "bg-gray-400"}`} />
            <div className={`w-2 h-2 rounded-full ${equipment.filterStatus ? "bg-blue-500" : "bg-gray-400"}`} />
          </div>
        </div>
        <span className="text-muted-foreground">
          {new Date(data.lastUpdated).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/pool-3d?id=${poolId}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
            <Eye className="h-3 w-3 mr-1" />
            Ver 3D
          </Button>
        </Link>
        <Link href={`/equipment?id=${poolId}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
            <Settings className="h-3 w-3 mr-1" />
            Control
          </Button>
        </Link>
      </div>
    </Card>
  )
}
