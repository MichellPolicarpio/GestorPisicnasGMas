import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Droplets, TrendingUp, ArrowRight } from "lucide-react"
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

          </div>
        </main>

          <Footer />
        </div>
      </div>
    </ProtectedRoute>
  )
}
