"use client"

import { useState } from "react"
import { useHistoricalData } from "@/lib/hooks/use-historical-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp, TrendingDown, Activity, Thermometer, Droplets, Zap, Calendar, RefreshCw } from "lucide-react"

interface AnalyticsChartsProps {
  poolId: string
}

const chartConfig = {
  temperature: {
    label: "Temperatura",
    color: "hsl(var(--chart-1))",
  },
  ph: {
    label: "pH",
    color: "hsl(var(--chart-2))",
  },
  chlorine: {
    label: "Cloro",
    color: "hsl(var(--chart-3))",
  },
  turbidity: {
    label: "Turbidez",
    color: "hsl(var(--chart-4))",
  },
  waterLevel: {
    label: "Nivel de Agua",
    color: "hsl(var(--chart-5))",
  },
}

export function AnalyticsCharts({ poolId }: AnalyticsChartsProps) {
  const [timeRange, setTimeRange] = useState("24")
  const { data, loading, error, refetch } = useHistoricalData({
    poolId,
    hours: Number.parseInt(timeRange),
  })

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Cargando datos históricos...</span>
        </div>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-destructive mb-2">Error al cargar los datos</p>
          <Button variant="outline" onClick={refetch}>
            Reintentar
          </Button>
        </div>
      </Card>
    )
  }

  // Format data for charts
  const chartData = data.readings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    fullTime: reading.timestamp,
    temperature: Number(reading.temperature.toFixed(1)),
    ph: Number(reading.ph.toFixed(2)),
    chlorine: Number(reading.chlorine.toFixed(1)),
    turbidity: Number(reading.turbidity.toFixed(1)),
    waterLevel: Number((reading.waterLevel * 100).toFixed(1)), // Convert to percentage
    oxygenLevel: Number(reading.oxygenLevel.toFixed(1)),
    alkalinity: Number(reading.alkalinity.toFixed(0)),
    conductivity: Number(reading.conductivity.toFixed(0)),
  }))

  // Calculate trends and statistics
  const getStatistics = (key: keyof (typeof chartData)[0]) => {
    const values = chartData.map((d) => d[key] as number).filter((v) => typeof v === "number")
    const current = values[values.length - 1]
    const previous = values[values.length - 2]
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    const trend = current > previous ? "up" : current < previous ? "down" : "stable"

    return { current, avg, min, max, trend }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Período:</span>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Últimas 6 horas</SelectItem>
                <SelectItem value="12">Últimas 12 horas</SelectItem>
                <SelectItem value="24">Últimas 24 horas</SelectItem>
                <SelectItem value="48">Últimas 48 horas</SelectItem>
                <SelectItem value="168">Última semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "temperature", label: "Temperatura", unit: "°C", icon: Thermometer, optimal: [24, 28] },
          { key: "ph", label: "pH", unit: "", icon: Droplets, optimal: [7.0, 7.6] },
          { key: "chlorine", label: "Cloro", unit: "ppm", icon: Activity, optimal: [1.0, 3.0] },
          { key: "turbidity", label: "Turbidez", unit: "NTU", icon: Zap, optimal: [0, 1.0] },
        ].map(({ key, label, unit, icon: Icon, optimal }) => {
          const stats = getStatistics(key as keyof (typeof chartData)[0])
          const isOptimal = stats.current >= optimal[0] && stats.current <= optimal[1]

          return (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-1">
                  {stats.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : stats.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-lg font-semibold">
                  {stats.current}
                  {unit}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Prom: {stats.avg.toFixed(1)}
                    {unit}
                  </span>
                  <Badge variant={isOptimal ? "default" : "secondary"} className="text-xs">
                    {isOptimal ? "Óptimo" : "Alerta"}
                  </Badge>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="water-quality">Calidad del Agua</TabsTrigger>
          <TabsTrigger value="temperature">Temperatura</TabsTrigger>
          <TabsTrigger value="levels">Niveles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tendencias Generales</h3>
            <ChartContainer config={chartConfig} className="h-80">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="var(--color-temperature)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line type="monotone" dataKey="ph" stroke="var(--color-ph)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="chlorine" stroke="var(--color-chlorine)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="water-quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">pH y Cloro</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="ph"
                    stackId="1"
                    stroke="var(--color-ph)"
                    fill="var(--color-ph)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="chlorine"
                    stackId="2"
                    stroke="var(--color-chlorine)"
                    fill="var(--color-chlorine)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Turbidez</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="turbidity" fill="var(--color-turbidity)" />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Análisis de Temperatura</h3>
            <ChartContainer config={chartConfig} className="h-80">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="var(--color-temperature)"
                  fill="var(--color-temperature)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nivel de Agua</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[80, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="waterLevel"
                    stroke="var(--color-waterLevel)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Oxígeno Disuelto</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="oxygenLevel"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ChartContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
