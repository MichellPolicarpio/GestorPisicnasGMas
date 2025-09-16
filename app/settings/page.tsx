"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Map, Database, Shield, MapPin } from "lucide-react"
import { AddressManager } from "@/components/pool/address-manager"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Configuración</h1>
              <p className="text-muted-foreground">Gestiona la configuración del sistema</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Perfil de Usuario</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" defaultValue="Administrador Sistema" />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" defaultValue="admin@masagua.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" defaultValue="+52 229 123 4567" />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Guardar Cambios</Button>
                </div>
              </Card>


              {/* Map Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Map className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Configuración del Mapa</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">Google Maps API Key</Label>
                    <Input id="api-key" type="password" defaultValue="AIzaSyCZNbaJPL33NYGfwgTBO1DXzMh9nfhQc28" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vista satelital por defecto</Label>
                      <p className="text-sm text-muted-foreground">Usar vista satelital al cargar</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-centrar en piscinas</Label>
                      <p className="text-sm text-muted-foreground">Centrar automáticamente en las piscinas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              {/* System Settings */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Sistema</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo oscuro</Label>
                      <p className="text-sm text-muted-foreground">Cambiar tema de la interfaz</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Actualizaciones automáticas</Label>
                      <p className="text-sm text-muted-foreground">Actualizar datos automáticamente</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <Label htmlFor="backup">Frecuencia de respaldo</Label>
                    <select className="w-full mt-1 p-2 border border-border rounded-md bg-background">
                      <option>Diario</option>
                      <option>Semanal</option>
                      <option>Mensual</option>
                    </select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Geocoding Section - NUEVA SECCIÓN */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Gestión de Direcciones (Geocoding)</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Obtén automáticamente las direcciones de todas las piscinas usando Google Reverse Geocoding API
              </p>
              <AddressManager showBatchActions={true} />
            </Card>

            {/* Security Section */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Seguridad</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Contraseña actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nueva contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button variant="outline">Cambiar Contraseña</Button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Sesiones Activas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Navegador actual</span>
                        <span className="text-primary">Activa</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Móvil - Chrome</span>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-destructive">
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
