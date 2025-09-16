"use client"

import { usePoolData } from "@/lib/hooks/use-pool-data"
import { useHistoricalData } from "@/lib/hooks/use-historical-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Target, Activity, Clock } from "lucide-react"

interface AnalyticsInsightsProps {
  poolId: string
}

export function AnalyticsInsights({ poolId }: AnalyticsInsightsProps) {
  const { data: currentData } = usePoolData({ poolId })
  const { data: historicalData } = useHistoricalData({ poolId, hours: 24 })

  if (!currentData || !historicalData) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Cargando análisis...</div>
      </Card>
    )
  }

  const { currentSensors, equipment, alerts } = currentData
  const readings = historicalData.readings

  // Calculate insights
  const getParameterHealth = (current: number, optimal: [number, number]) => {
    if (current >= optimal[0] && current <= optimal[1]) return "excellent"
    if (current >= optimal[0] - 0.2 && current <= optimal[1] + 0.2) return "good"
    if (current >= optimal[0] - 0.5 && current <= optimal[1] + 0.5) return "warning"
    return "critical"
  }

  const getTrend = (parameter: string) => {
    const recent = readings.slice(-6).map((r) => (r as any)[parameter])
    const older = readings.slice(-12, -6).map((r) => (r as any)[parameter])
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    return recentAvg > olderAvg ? "improving" : recentAvg < olderAvg ? "declining" : "stable"
  }

  const parameters = [
    {
      name: "Temperatura",
      current: currentSensors.temperature,
      optimal: [24, 28] as [number, number],
      unit: "°C",
      key: "temperature",
    },
    {
      name: "pH",
      current: currentSensors.ph,
      optimal: [7.0, 7.6] as [number, number],
      unit: "",
      key: "ph",
    },
    {
      name: "Cloro",
      current: currentSensors.chlorine,
      optimal: [1.0, 3.0] as [number, number],
      unit: "ppm",
      key: "chlorine",
    },
    {
      name: "Turbidez",
      current: currentSensors.turbidity,
      optimal: [0, 1.0] as [number, number],
      unit: "NTU",
      key: "turbidity",
    },
  ]

  const overallHealth =
    parameters.reduce((score, param) => {
      const health = getParameterHealth(param.current, param.optimal)
      return score + (health === "excellent" ? 100 : health === "good" ? 80 : health === "warning" ? 60 : 30)
    }, 0) / parameters.length

  const equipmentEfficiency = (Object.values(equipment).filter(Boolean).length / Object.keys(equipment).length) * 100

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Estado General de la Piscina</h3>
          <Badge variant={overallHealth >= 90 ? "default" : overallHealth >= 70 ? "secondary" : "destructive"}>
            {overallHealth >= 90 ? "Excelente" : overallHealth >= 70 ? "Bueno" : "Requiere Atención"}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Calidad del Agua</span>
              <span className="text-sm text-muted-foreground">{overallHealth.toFixed(0)}%</span>
            </div>
            <Progress value={overallHealth} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Eficiencia del Equipo</span>
              <span className="text-sm text-muted-foreground">{equipmentEfficiency.toFixed(0)}%</span>
            </div>
            <Progress value={equipmentEfficiency} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Parameter Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Análisis de Parámetros</h3>
        <div className="space-y-4">
          {parameters.map((param) => {
            const health = getParameterHealth(param.current, param.optimal)
            const trend = getTrend(param.key)

            return (
              <div key={param.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      health === "excellent"
                        ? "bg-green-500"
                        : health === "good"
                          ? "bg-blue-500"
                          : health === "warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{param.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {param.current.toFixed(param.key === "ph" ? 1 : 1)}
                      {param.unit} (Óptimo: {param.optimal[0]}-{param.optimal[1]}
                      {param.unit})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {trend === "improving" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : trend === "declining" ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <Activity className="h-4 w-4 text-gray-500" />
                  )}
                  <Badge
                    variant={
                      health === "excellent" || health === "good"
                        ? "default"
                        : health === "warning"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {health === "excellent"
                      ? "Excelente"
                      : health === "good"
                        ? "Bueno"
                        : health === "warning"
                          ? "Atención"
                          : "Crítico"}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recomendaciones</h3>
        <div className="space-y-3">
          {/* pH Recommendations */}
          {(currentSensors.ph < 7.0 || currentSensors.ph > 7.6) && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                {currentSensors.ph < 7.0
                  ? "El pH está bajo. Considera agregar incrementador de pH para alcanzar el rango óptimo."
                  : "El pH está alto. Considera agregar decrementador de pH para alcanzar el rango óptimo."}
              </AlertDescription>
            </Alert>
          )}

          {/* Chlorine Recommendations */}
          {(currentSensors.chlorine < 1.0 || currentSensors.chlorine > 3.0) && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                {currentSensors.chlorine < 1.0
                  ? "Nivel de cloro bajo. Agrega cloro para mantener la desinfección adecuada."
                  : "Nivel de cloro alto. Reduce la dosificación de cloro o permite que se disipe naturalmente."}
              </AlertDescription>
            </Alert>
          )}

          {/* Turbidity Recommendations */}
          {currentSensors.turbidity > 1.0 && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                Agua turbia detectada. Verifica el sistema de filtración y considera un tratamiento clarificante.
              </AlertDescription>
            </Alert>
          )}

          {/* Equipment Recommendations */}
          {!equipment.pumpStatus && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                La bomba principal está apagada. Actívala para mantener la circulación del agua.
              </AlertDescription>
            </Alert>
          )}

          {/* Maintenance Recommendations */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Último mantenimiento: {new Date(equipment.lastMaintenance).toLocaleDateString("es-ES")}. Programa el
              próximo mantenimiento preventivo.
            </AlertDescription>
          </Alert>

          {/* Positive feedback when everything is good */}
          {overallHealth >= 90 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ¡Excelente! Todos los parámetros están en rangos óptimos. Continúa con el mantenimiento regular.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Active Alerts Summary */}
      {alerts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Alertas Activas ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm">{alert.message}</span>
                <Badge
                  variant={
                    alert.priority === "critical" ? "destructive" : alert.priority === "high" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {alert.priority}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
