import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, BarChart3, Users, Droplets, TrendingUp, ArrowRight, CheckCircle, Building2, Zap, Plus } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/maps/google-map"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <div className="flex-1 flex flex-col md:ml-0">
          <Header />

          <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Identificación de Piscinas</h1>
              <p className="text-muted-foreground">Mapeo y captura de ubicaciones de piscinas en la ciudad - Grupo MAs Agua</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Piscinas</p>
                    <p className="text-2xl font-bold">1,395</p>
                    <p className="text-xs text-accent">Identificadas en la ciudad</p>
                  </div>
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revisadas</p>
                    <p className="text-2xl font-bold text-primary">0</p>
                    <p className="text-xs text-primary">0% completado</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No Revisadas</p>
                    <p className="text-2xl font-bold text-destructive">1,395</p>
                    <p className="text-xs text-destructive">Pendientes</p>
                  </div>
                  <Droplets className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                    <p className="text-2xl font-bold">0%</p>
                    <p className="text-xs text-accent">Iniciando identificación</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </Card>
            </div>

            {/* Interactive Map */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Mapa de Identificación de Piscinas</h3>
                <Link href="/pools">
                  <Button variant="outline" size="sm">
                    Ver Todas las Ubicaciones
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="h-96 rounded-lg overflow-hidden border">
                <GoogleMap />
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Estatus de Piscinas</h3>
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">Gestiona el estado de revisión de piscinas</p>
                <Link href="/pool-status">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Estatus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Agregar Piscina</h3>
                  <Plus className="h-5 w-5 text-accent" />
                </div>
                <p className="text-muted-foreground mb-4">Registra nuevas piscinas con coordenadas</p>
                <Link href="/add-pool">
                  <Button variant="outline" className="w-full bg-transparent">
                    Agregar Nueva
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Propietarios</h3>
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <p className="text-muted-foreground mb-4">Administra información de propietarios</p>
                <Link href="/owners">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Propietarios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Modalidad de Consumo</h3>
                  <Zap className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-muted-foreground mb-4">Configura tipos de consumo y tarifas</p>
                <Link href="/consumption">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Modalidades
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Reportes</h3>
                  <BarChart3 className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-muted-foreground mb-4">Analiza estadísticas y genera reportes</p>
                <Link href="/reports">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Reportes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Progreso de Identificación</h3>
              <div className="space-y-4">
                {[
                  {
                    action: "Piscina identificada",
                    detail: "pool1049 - Zona Residencial Norte",
                    time: "Hace 1 hora",
                    type: "success",
                  },
                  {
                    action: "Ubicación verificada",
                    detail: "pool1046 - Coordenadas confirmadas",
                    time: "Hace 3 horas",
                    type: "success",
                  },
                  {
                    action: "Nueva zona explorada",
                    detail: "Sector Sur - 15 piscinas encontradas",
                    time: "Hace 5 horas",
                    type: "pending",
                  },
                  { action: "Mapeo completado", detail: "Zona Centro - 100% cobertura", time: "Ayer", type: "info" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "success"
                          ? "bg-primary"
                          : activity.type === "pending"
                            ? "bg-accent"
                            : activity.type === "info"
                              ? "bg-secondary"
                              : "bg-destructive"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.detail}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>

          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  )
}
