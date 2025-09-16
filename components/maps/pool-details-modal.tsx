"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Droplets, ExternalLink } from "lucide-react"

interface PoolLocation {
  lat: number
  lon: number
  description: string
  captured: boolean
}

interface PoolDetailsModalProps {
  pool: PoolLocation | null
  isOpen: boolean
  onClose: () => void
}

export function PoolDetailsModal({ pool, isOpen, onClose }: PoolDetailsModalProps) {
  if (!pool) return null

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${pool.lat},${pool.lon}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {pool.description}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <Badge
              variant={pool.captured ? "default" : "destructive"}
              className={
                pool.captured ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
              }
            >
              {pool.captured ? "Capturada" : "Pendiente"}
            </Badge>
          </div>

          {/* Coordinates */}
          <Card className="p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Coordenadas
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Latitud: {pool.lat.toFixed(8)}</p>
              <p>Longitud: {pool.lon.toFixed(8)}</p>
            </div>
          </Card>

          {/* Mock additional data */}
          <Card className="p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Información de la Piscina
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span>Residencial</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tamaño estimado:</span>
                <span>Mediana</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Última inspección:</span>
                <span>{pool.captured ? "15/11/2024" : "Pendiente"}</span>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={openInGoogleMaps} className="flex-1 bg-transparent" variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver en Google Maps
            </Button>
            <Button onClick={onClose} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
