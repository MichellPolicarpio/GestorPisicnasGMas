"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePools } from "@/lib/contexts/pools-context"
import { downloadPoolPDF } from "@/lib/utils/pdf-generator"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  FileWarning,
} from "lucide-react"

export default function ReportsPage() {
  const { pools } = usePools()

  const capturedPools = pools.filter((pool) => pool.captured)
  const totalPools = pools.length
  const pendingPools = totalPools - capturedPools.length
  const completionRate = totalPools === 0 ? 0 : Math.round((capturedPools.length / totalPools) * 100)

  const handleGeneratePdf = (pool: (typeof pools)[number]) => {
    downloadPoolPDF({
      id: pool.description,
      lat: pool.lat,
      lon: pool.lon,
      description: pool.description,
      captured: pool.captured,
      owner: pool.owner,
      consumptionType: pool.consumptionType,
      notes: pool.notes,
      lastUpdated: pool.lastUpdated,
      addressInfo: pool.addressInfo,
      addressLastFetched: pool.addressLastFetched,
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reportes</h1>
              <p className="text-muted-foreground">Piscinas con inspección completada y métricas generales</p>
            </div>

            {/* Reviewed Pools */}
            <Card className="p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Piscinas revisadas</h2>
                  <p className="text-sm text-muted-foreground">Últimas inspecciones con estatus actualizado</p>
                </div>
                <Badge variant="outline" className="w-fit md:w-auto">
                  {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
                </Badge>
              </div>

              {capturedPools.length > 0 ? (
                <div className="mt-6 space-y-5">
                  {capturedPools.map((pool) => (
                    <div
                      key={pool.description}
                      className="flex flex-col gap-4 rounded-lg border border-border bg-card/40 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-card-foreground">{pool.description}</h3>
                          <Badge variant="secondary">Revisada</Badge>
                          <span className="text-xs text-muted-foreground">ID: {pool.description}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pool.addressInfo?.formattedAddress ?? "Dirección pendiente de confirmar"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Última actualización: {pool.lastUpdated ?? "Sin fecha"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button size="sm" className="gap-2" onClick={() => handleGeneratePdf(pool)}>
                          <FileText className="h-4 w-4" /> Generar PDF
                        </Button>
                        <Button size="sm" variant="outline" className="gap-2" asChild>
                          <Link href={`/pools?pool=${encodeURIComponent(pool.description)}`}>
                            <MapPin className="h-4 w-4" /> Ver ubicación
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  <FileWarning className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-card-foreground">No hay piscinas marcadas como revisadas</p>
                    <p>Actualiza el estatus desde el panel de estatus de piscinas para verlas aquí.</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Piscinas</p>
                    <p className="text-2xl font-bold">{totalPools}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capturadas</p>
                    <p className="text-2xl font-bold text-primary">{capturedPools.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-destructive">{pendingPools}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
              </Card>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
