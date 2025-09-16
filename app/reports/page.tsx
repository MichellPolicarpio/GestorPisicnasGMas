import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, MapPin, Calendar } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reportes</h1>
              <p className="text-muted-foreground">Análisis y estadísticas del sistema de piscinas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Piscinas</p>
                    <p className="text-2xl font-bold">127</p>
                  </div>
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capturadas</p>
                    <p className="text-2xl font-bold text-primary">89</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-destructive">38</p>
                  </div>
                  <Calendar className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progreso</p>
                    <p className="text-2xl font-bold">70%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {[
                  { action: "Piscina capturada", pool: "pool1046", time: "Hace 2 horas", status: "success" },
                  { action: "Inspección programada", pool: "pool1047", time: "Hace 4 horas", status: "pending" },
                  { action: "Mantenimiento completado", pool: "pool1044", time: "Ayer", status: "success" },
                  { action: "Problema reportado", pool: "pool1048", time: "Hace 2 días", status: "error" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.status === "success"
                            ? "bg-primary"
                            : activity.status === "pending"
                              ? "bg-accent"
                              : "bg-destructive"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.pool}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
