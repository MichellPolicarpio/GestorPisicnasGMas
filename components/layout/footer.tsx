import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, ExternalLink, Shield, Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Grupo MAs Agua</h3>
              <p className="text-sm text-muted-foreground">
                Soluciones integrales para el monitoreo y gestión de piscinas en Veracruz.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Certificado ISO 9001
              </Badge>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+52 (229) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>soporte@masagua.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Veracruz, México</span>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Servicios</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monitoreo en tiempo real</p>
              <p>Análisis de calidad del agua</p>
              <p>Mantenimiento preventivo</p>
              <p>Reportes automatizados</p>
            </div>
          </div>

        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <p>&copy; 2024 Grupo MAs Agua de Veracruz. Todos los derechos reservados.</p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Versión 1.0.0</span>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3 w-3 mr-1" />
                Documentación
              </Button>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                <Users className="h-3 w-3 mr-1" />
                Soporte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
