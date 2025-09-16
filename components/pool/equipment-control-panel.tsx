"use client"

import { useState } from "react"
import { usePoolData } from "@/lib/hooks/use-pool-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  Thermometer,
  Lightbulb,
  Droplets,
  Zap,
  Settings,
  Power,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EquipmentControlPanelProps {
  poolId: string
}

export function EquipmentControlPanel({ poolId }: EquipmentControlPanelProps) {
  const { data, loading, error, updateEquipment } = usePoolData({
    poolId,
    enableRealtime: true,
  })

  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  if (loading) {
    return (
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
          <span>Cargando controles...</span>
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Error al cargar los controles del equipo</AlertDescription>
        </Alert>
      </Card>
    )
  }

  const { equipment } = data

  const handleEquipmentToggle = async (equipmentType: string, newStatus: boolean) => {
    setIsUpdating(equipmentType)
    try {
      await updateEquipment({ [equipmentType]: newStatus })
      toast({
        title: "Equipo actualizado",
        description: `${equipmentType === "pumpStatus" ? "Bomba" : equipmentType === "heaterStatus" ? "Calentador" : equipmentType === "lightStatus" ? "Iluminación" : "Equipo"} ${newStatus ? "encendido" : "apagado"} correctamente`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleSpeedChange = async (newSpeed: number[]) => {
    setIsUpdating("pumpSpeed")
    try {
      await updateEquipment({ pumpSpeed: newSpeed[0] })
      toast({
        title: "Velocidad actualizada",
        description: `Velocidad de bomba ajustada a ${newSpeed[0]}%`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo ajustar la velocidad",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleTemperatureChange = async (newTemp: number[]) => {
    setIsUpdating("heaterTemperature")
    try {
      await updateEquipment({ heaterTemperature: newTemp[0] })
      toast({
        title: "Temperatura ajustada",
        description: `Temperatura objetivo: ${newTemp[0]}°C`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo ajustar la temperatura",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Main Equipment Controls */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Control de Equipos</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Pump Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-4 md:h-5 w-4 md:w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">Bomba Principal</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Sistema de circulación</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={equipment.pumpStatus ? "default" : "secondary"} className="text-xs">
                  {equipment.pumpStatus ? "ACTIVA" : "INACTIVA"}
                </Badge>
                <Switch
                  checked={equipment.pumpStatus}
                  onCheckedChange={(checked) => handleEquipmentToggle("pumpStatus", checked)}
                  disabled={isUpdating === "pumpStatus"}
                />
              </div>
            </div>

            {equipment.pumpStatus && (
              <div className="p-3 md:p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Velocidad</span>
                  </div>
                  <span className="text-sm font-semibold">{equipment.pumpSpeed}%</span>
                </div>
                <Slider
                  value={[equipment.pumpSpeed]}
                  onValueChange={handleSpeedChange}
                  max={100}
                  min={20}
                  step={5}
                  className="w-full"
                  disabled={isUpdating === "pumpSpeed"}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20%</span>
                  <span>100%</span>
                </div>
              </div>
            )}
          </div>

          {/* Heater Control */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Thermometer className="h-4 md:h-5 w-4 md:w-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm md:text-base">Calentador</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Control de temperatura</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={equipment.heaterStatus ? "default" : "secondary"} className="text-xs">
                  {equipment.heaterStatus ? "ENCENDIDO" : "APAGADO"}
                </Badge>
                <Switch
                  checked={equipment.heaterStatus}
                  onCheckedChange={(checked) => handleEquipmentToggle("heaterStatus", checked)}
                  disabled={isUpdating === "heaterStatus"}
                />
              </div>
            </div>

            {equipment.heaterStatus && (
              <div className="p-3 md:p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">Temperatura Objetivo</span>
                  </div>
                  <span className="text-sm font-semibold">{equipment.heaterTemperature.toFixed(1)}°C</span>
                </div>
                <Slider
                  value={[equipment.heaterTemperature]}
                  onValueChange={handleTemperatureChange}
                  max={35}
                  min={20}
                  step={0.5}
                  className="w-full"
                  disabled={isUpdating === "heaterTemperature"}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>20°C</span>
                  <span>35°C</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4 md:my-6" />

        {/* Secondary Equipment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {/* Lighting Control */}
          <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Iluminación</h5>
                <p className="text-xs text-muted-foreground">LED subacuática</p>
              </div>
            </div>
            <Switch
              checked={equipment.lightStatus}
              onCheckedChange={(checked) => handleEquipmentToggle("lightStatus", checked)}
              disabled={isUpdating === "lightStatus"}
            />
          </div>

          {/* Filter Control */}
          <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Droplets className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Filtro</h5>
                <p className="text-xs text-muted-foreground">Sistema de filtrado</p>
              </div>
            </div>
            <Switch
              checked={equipment.filterStatus}
              onCheckedChange={(checked) => handleEquipmentToggle("filterStatus", checked)}
              disabled={isUpdating === "filterStatus"}
            />
          </div>

          {/* UV System Control */}
          <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Zap className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h5 className="font-medium text-sm">Sistema UV</h5>
                <p className="text-xs text-muted-foreground">Desinfección UV</p>
              </div>
            </div>
            <Switch
              checked={equipment.uvStatus}
              onCheckedChange={(checked) => handleEquipmentToggle("uvStatus", checked)}
              disabled={isUpdating === "uvStatus"}
            />
          </div>
        </div>
      </Card>

      {/* Equipment Status Summary */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Power className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Estado General del Sistema</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {equipment.pumpStatus ? (
                <CheckCircle className="h-5 md:h-6 w-5 md:w-6 text-green-500" />
              ) : (
                <Power className="h-5 md:h-6 w-5 md:w-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium">Circulación</p>
            <p className="text-xs text-muted-foreground">
              {equipment.pumpStatus ? `${equipment.pumpSpeed}% velocidad` : "Detenida"}
            </p>
          </div>

          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {equipment.heaterStatus ? (
                <Thermometer className="h-5 md:h-6 w-5 md:w-6 text-red-500" />
              ) : (
                <Thermometer className="h-5 md:h-6 w-5 md:w-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium">Calefacción</p>
            <p className="text-xs text-muted-foreground">
              {equipment.heaterStatus ? `${equipment.heaterTemperature.toFixed(1)}°C objetivo` : "Apagada"}
            </p>
          </div>

          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {equipment.filterStatus ? (
                <Droplets className="h-5 md:h-6 w-5 md:w-6 text-blue-500" />
              ) : (
                <Droplets className="h-5 md:h-6 w-5 md:w-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium">Filtración</p>
            <p className="text-xs text-muted-foreground">{equipment.filterStatus ? "Activa" : "Inactiva"}</p>
          </div>

          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {equipment.lightStatus ? (
                <Lightbulb className="h-5 md:h-6 w-5 md:w-6 text-yellow-500" />
              ) : (
                <Lightbulb className="h-5 md:h-6 w-5 md:w-6 text-gray-400" />
              )}
            </div>
            <p className="text-sm font-medium">Iluminación</p>
            <p className="text-xs text-muted-foreground">{equipment.lightStatus ? "Encendida" : "Apagada"}</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Último mantenimiento:</span>
          </div>
          <span className="font-medium">
            {new Date(equipment.lastMaintenance).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <Button
            variant="outline"
            className="h-auto p-3 md:p-4 flex flex-col items-center gap-2 bg-transparent text-xs md:text-sm"
            onClick={() => {
              handleEquipmentToggle("pumpStatus", true)
              handleEquipmentToggle("filterStatus", true)
            }}
          >
            <Activity className="h-4 md:h-5 w-4 md:w-5" />
            <span>Iniciar Circulación</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-3 md:p-4 flex flex-col items-center gap-2 bg-transparent text-xs md:text-sm"
            onClick={() => {
              handleEquipmentToggle("pumpStatus", false)
              handleEquipmentToggle("heaterStatus", false)
              handleEquipmentToggle("lightStatus", false)
            }}
          >
            <Power className="h-4 md:h-5 w-4 md:w-5" />
            <span>Apagar Todo</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-3 md:p-4 flex flex-col items-center gap-2 bg-transparent text-xs md:text-sm"
            onClick={() => {
              handleEquipmentToggle("lightStatus", true)
            }}
          >
            <Lightbulb className="h-4 md:h-5 w-4 md:w-5" />
            <span>Modo Nocturno</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-3 md:p-4 flex flex-col items-center gap-2 bg-transparent text-xs md:text-sm"
            onClick={() => {
              handleEquipmentToggle("pumpStatus", true)
              handleEquipmentToggle("heaterStatus", true)
              handleEquipmentToggle("filterStatus", true)
            }}
          >
            <Thermometer className="h-4 md:h-5 w-4 md:w-5" />
            <span>Modo Calefacción</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
