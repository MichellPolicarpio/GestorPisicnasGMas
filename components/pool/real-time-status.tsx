"use client"

import { usePoolData } from "@/lib/hooks/use-pool-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Thermometer,
  Droplets,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface RealTimeStatusProps {
  poolId: string
}

export function RealTimeStatus({ poolId }: RealTimeStatusProps) {
  const { data, loading, error, connected, reconnect } = usePoolData({
    poolId,
    enableRealtime: true,
  })

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Cargando datos en tiempo real...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error: {error}
            <Button variant="outline" size="sm" onClick={reconnect} className="ml-2 bg-transparent">
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </Card>
    )
  }

  if (!data) return null

  const { currentSensors, equipment, alerts } = data

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
            <span className="text-sm font-medium">{connected ? "Conectado en tiempo real" : "Desconectado"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={connected ? "default" : "secondary"}>{connected ? "LIVE" : "OFFLINE"}</Badge>
            {!connected && (
              <Button variant="outline" size="sm" onClick={reconnect}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reconectar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Alertas Activas ({alerts.length})
          </h4>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <Alert key={alert.id} variant={alert.type === "error" ? "destructive" : "default"} className="py-2">
                <AlertDescription className="text-sm">
                  <div className="flex items-center justify-between">
                    <span>{alert.message}</span>
                    <Badge
                      variant={
                        alert.priority === "critical"
                          ? "destructive"
                          : alert.priority === "high"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Sensor Readings */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Lecturas de Sensores</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Thermometer className="h-3 w-3 text-primary" />
              <span className="text-xs">Temperatura</span>
            </div>
            <span className="text-sm font-semibold">{currentSensors.temperature.toFixed(1)}°C</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Droplets className="h-3 w-3 text-primary" />
              <span className="text-xs">pH</span>
            </div>
            <span className="text-sm font-semibold">{currentSensors.ph.toFixed(1)}</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-primary" />
              <span className="text-xs">Cloro</span>
            </div>
            <span className="text-sm font-semibold">{currentSensors.chlorine.toFixed(1)} ppm</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs">Turbidez</span>
            </div>
            <span className="text-sm font-semibold">{currentSensors.turbidity.toFixed(1)} NTU</span>
          </div>
        </div>
      </Card>

      {/* Equipment Status */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3">Estado del Equipo</h4>
        <div className="space-y-2">
          {[
            { name: "Bomba Principal", status: equipment.pumpStatus, icon: Activity },
            { name: "Calentador", status: equipment.heaterStatus, icon: Thermometer },
            { name: "Iluminación", status: equipment.lightStatus, icon: Zap },
            { name: "Filtro", status: equipment.filterStatus, icon: Droplets },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="h-3 w-3" />
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.status ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-gray-400" />
                )}
                <Badge variant={item.status ? "default" : "secondary"} className="text-xs">
                  {item.status ? "ON" : "OFF"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
