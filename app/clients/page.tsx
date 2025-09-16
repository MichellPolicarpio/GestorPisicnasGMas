import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Phone, Mail, MapPin, Plus, Search } from "lucide-react"

const clients = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+52 229 123 4567",
    address: "Col. Centro, Veracruz",
    pools: 2,
    status: "active",
    lastContact: "2024-11-15",
  },
  {
    id: 2,
    name: "Carlos Hernández",
    email: "carlos.hernandez@email.com",
    phone: "+52 229 234 5678",
    address: "Col. Reforma, Veracruz",
    pools: 1,
    status: "active",
    lastContact: "2024-11-14",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+52 229 345 6789",
    address: "Col. Flores Magón, Veracruz",
    pools: 3,
    status: "pending",
    lastContact: "2024-11-10",
  },
]

export default function ClientsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
                <p className="text-muted-foreground">Gestión de clientes y propietarios de piscinas</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Buscar clientes..." className="pl-10" />
                </div>
                <Button variant="outline">Filtros</Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                    <p className="text-2xl font-bold text-primary">42</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-bold text-destructive">3</p>
                  </div>
                  <Users className="h-8 w-8 text-destructive" />
                </div>
              </Card>
            </div>

            {/* Clients List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Lista de Clientes</h3>
              <div className="space-y-4">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{client.name}</h4>
                          <Badge
                            variant={client.status === "active" ? "default" : "destructive"}
                            className={
                              client.status === "active"
                                ? "bg-primary text-primary-foreground"
                                : "bg-destructive text-destructive-foreground"
                            }
                          >
                            {client.status === "active" ? "Activo" : "Pendiente"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {client.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{client.pools} piscinas</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">Último contacto: {client.lastContact}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                        <Button variant="outline" size="sm">
                          Contactar
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
