import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Droplets, Calendar, Clock, AlertTriangle, CheckCircle, Plus } from "lucide-react"

const maintenanceTasks = [
  {
    id: 1,
    pool: "pool1044",
    client: "María González",
    task: "Limpieza general y análisis químico",
    priority: "high",
    status: "pending",
    dueDate: "2024-11-16",
    assignedTo: "Juan Pérez",
  },
  {
    id: 2,
    pool: "pool1047",
    client: "Carlos Hernández",
    task: "Reparación de filtro",
    priority: "urgent",
    status: "in-progress",
    dueDate: "2024-11-15",
    assignedTo: "Ana López",
  },
  {
    id: 3,
    pool: "pool1048",
    client: "Ana Martínez",
    task: "Mantenimiento preventivo",
    priority: "medium",
    status: "pending",
    dueDate: "2024-11-18",
    assignedTo: "Pedro García",
  },
  {
    id: 4,
    pool: "pool1045",
    client: "Roberto Silva",
    task: "Limpieza completada",
    priority: "low",
    status: "completed",
    dueDate: "2024-11-14",
    assignedTo: "Juan Pérez",
  },
]

export default function MaintenancePage() {
  const pendingTasks = maintenanceTasks.filter((task) => task.status === "pending")
  const inProgressTasks = maintenanceTasks.filter((task) => task.status === "in-progress")
  const completedTasks = maintenanceTasks.filter((task) => task.status === "completed")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Mantenimiento</h1>
                <p className="text-muted-foreground">Gestión de tareas de mantenimiento de piscinas</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tareas</p>
                    <p className="text-2xl font-bold">{maintenanceTasks.length}</p>
                  </div>
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-destructive">{pendingTasks.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                    <p className="text-2xl font-bold text-accent">{inProgressTasks.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completadas</p>
                    <p className="text-2xl font-bold text-primary">{completedTasks.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </Card>
            </div>

            {/* Tasks List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tareas de Mantenimiento</h3>
              <div className="space-y-4">
                {maintenanceTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{task.pool}</h4>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "default"
                                : task.status === "in-progress"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              task.status === "completed"
                                ? "bg-primary text-primary-foreground"
                                : task.status === "in-progress"
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-destructive text-destructive-foreground"
                            }
                          >
                            {task.status === "completed"
                              ? "Completada"
                              : task.status === "in-progress"
                                ? "En Progreso"
                                : "Pendiente"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              task.priority === "urgent"
                                ? "border-destructive text-destructive"
                                : task.priority === "high"
                                  ? "border-accent text-accent"
                                  : "border-muted-foreground text-muted-foreground"
                            }
                          >
                            {task.priority === "urgent"
                              ? "Urgente"
                              : task.priority === "high"
                                ? "Alta"
                                : task.priority === "medium"
                                  ? "Media"
                                  : "Baja"}
                          </Badge>
                        </div>

                        <p className="text-sm mb-2">{task.task}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Vence: {task.dueDate}
                          </div>
                          <div>Cliente: {task.client}</div>
                          <div>Asignado a: {task.assignedTo}</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {task.status === "pending" && (
                          <Button variant="outline" size="sm" className="bg-accent text-accent-foreground">
                            Iniciar
                          </Button>
                        )}
                        {task.status === "in-progress" && (
                          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                            Completar
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
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
