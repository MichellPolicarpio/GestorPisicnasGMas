"use client"

import { useEffect, useRef, useState, memo, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Loader2, RefreshCw } from "lucide-react"
import { usePools } from "@/lib/contexts/pools-context"

interface PoolLocation {
  lat: number
  lon: number
  description: string
  captured: boolean // true = revisada, false = no revisada
}

interface GoogleMapProps {
  pools?: PoolLocation[]
  apiKey?: string
  centerPoolId?: string | null
}

const defaultApiKey = "AIzaSyCZNbaJPL33NYGfwgTBO1DXzMh9nfhQc28"

function GoogleMapComponent({ pools: externalPools, apiKey = defaultApiKey, centerPoolId }: GoogleMapProps) {
  const { pools: contextPools, togglePoolStatus, setCenterOnPool } = usePools()
  
  // Memoizar los pools para evitar recálculos innecesarios
  const pools = useMemo(() => {
    return externalPools || contextPools
  }, [externalPools, contextPools])
  
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [selectedPool, setSelectedPool] = useState<PoolLocation | null>(null)

  // Memoizar centro del mapa para evitar recálculos innecesarios
  const mapCenter = useMemo(() => {
    if (pools.length === 0) return { lat: 19.1665, lng: -96.1111 }
    
    const centerLat = pools.reduce((sum, pool) => sum + pool.lat, 0) / pools.length
    const centerLon = pools.reduce((sum, pool) => sum + pool.lon, 0) / pools.length
    return { lat: centerLat, lng: centerLon }
  }, [pools])

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!(window as any).google) {
          const script = document.createElement("script")
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
          script.async = true
          script.defer = true

          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Google Maps"))
            document.head.appendChild(script)
          })
        }

        if (mapRef.current && (window as any).google) {
          const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
            center: mapCenter,
            zoom: 16,
            mapTypeId: (window as any).google.maps.MapTypeId.SATELLITE,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          })

          setMap(mapInstance)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading map")
      } finally {
        setIsLoading(false)
      }
    }

    initializeMap()
  }, [apiKey, mapCenter])

  // Add markers when map is ready
  useEffect(() => {
    if (!map || pools.length === 0 || !(window as any).google) return

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null))

    // Create new markers - solo para coordenadas válidas
    const newMarkers = pools
      .filter(pool => 
        typeof pool.lat === 'number' && typeof pool.lon === 'number' && 
        !isNaN(pool.lat) && !isNaN(pool.lon) && 
        isFinite(pool.lat) && isFinite(pool.lon) &&
        pool.lat >= -90 && pool.lat <= 90 && pool.lon >= -180 && pool.lon <= 180
      )
      .map((pool) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: pool.lat, lng: pool.lon },
          map: map,
          title: pool.description,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: pool.captured ? "#0891b2" : "#ef4444",
            fillOpacity: 0.9,
            strokeColor: "#ffffff",
            strokeWeight: 3,
          },
        })

      // Add click listener to show details and toggle status
      marker.addListener("click", () => {
        setSelectedPool(pool)
        // Center map on selected pool
        map.panTo({ lat: pool.lat, lng: pool.lon })
      })

      return marker
    })

    setMarkers(newMarkers)
  }, [map, pools])

  const refreshMap = () => {
    if (map && pools.length > 0) {
      map.setCenter(mapCenter)
      map.setZoom(16)
    }
  }

  // Configurar la función de centrado cuando el mapa esté listo
  useEffect(() => {
    if (map) {
      setCenterOnPool((lat: number, lon: number) => {
        // Validar que las coordenadas sean números válidos
        if (typeof lat === 'number' && typeof lon === 'number' && 
            !isNaN(lat) && !isNaN(lon) && 
            isFinite(lat) && isFinite(lon) &&
            lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          map.panTo({ lat, lng: lon })
          map.setZoom(18)
        } else {
          console.error('Coordenadas inválidas:', { lat, lon })
        }
      })
    }
  }, [map, setCenterOnPool])

  // Centrar automáticamente cuando se recibe un centerPoolId
  useEffect(() => {
    if (map && centerPoolId) {
      const pool = pools.find(p => p.description === centerPoolId)
      if (pool && typeof pool.lat === 'number' && typeof pool.lon === 'number' && 
          !isNaN(pool.lat) && !isNaN(pool.lon) && 
          isFinite(pool.lat) && isFinite(pool.lon) &&
          pool.lat >= -90 && pool.lat <= 90 && pool.lon >= -180 && pool.lon <= 180) {
        map.panTo({ lat: pool.lat, lng: pool.lon })
        map.setZoom(18)
        
        // Crear marcador especial para la piscina destacada
        const highlightedMarker = new (window as any).google.maps.Marker({
          position: { lat: pool.lat, lng: pool.lon },
          map: map,
          title: `⭐ ${pool.description} - Piscina Destacada`,
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: "#FFD700", // Dorado
            fillOpacity: 1.0,
            strokeColor: "#FF6B35", // Naranja
            strokeWeight: 4,
          },
          zIndex: 1000, // Asegurar que esté encima de otros marcadores
          animation: (window as any).google.maps.Animation.BOUNCE
        })
        
        // Hacer que el marcador deje de rebotar después de 3 segundos
        setTimeout(() => {
          highlightedMarker.setAnimation(null)
        }, 3000)
        
        // Agregar listener para mostrar información
        highlightedMarker.addListener("click", () => {
          setSelectedPool(pool)
        })
        
        // Limpiar el marcador destacado cuando cambie el centerPoolId
        return () => {
          highlightedMarker.setMap(null)
        }
      }
    }
  }, [map, centerPoolId, pools])

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar el mapa</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="h-full relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Card className="p-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-foreground">Revisadas ({pools.filter((p) => p.captured).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-foreground">No Revisadas ({pools.filter((p) => !p.captured).length})</span>
            </div>
            {centerPoolId && (
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-orange-500"></div>
                <span className="text-foreground font-medium">⭐ Destacada</span>
              </div>
            )}
          </div>
        </Card>

        <Button size="sm" onClick={refreshMap} variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Cargando mapa...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Stats bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <Card className="p-3 bg-card border border-border">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-foreground">
                Total: {pools.length} piscinas
              </Badge>
              <Badge className="bg-primary text-primary-foreground">
                Revisadas: {pools.filter((p) => p.captured).length}
              </Badge>
              <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                No Revisadas: {pools.filter((p) => !p.captured).length}
              </Badge>
            </div>
            <div className="text-muted-foreground">Veracruz, México</div>
          </div>
        </Card>
      </div>

      {/* Selected Pool Info */}
      {selectedPool && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{selectedPool.description}</h4>
              <Badge
                className={
                  selectedPool.captured
                    ? "bg-primary text-primary-foreground"
                    : "bg-destructive text-destructive-foreground"
                }
              >
                {selectedPool.captured ? "Revisada" : "No Revisada"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Lat: {selectedPool.lat.toFixed(6)}, Lon: {selectedPool.lon.toFixed(6)}
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => {
                  togglePoolStatus(selectedPool.description)
                  setSelectedPool(null)
                }}
                className={selectedPool.captured ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
              >
                {selectedPool.captured ? "Marcar No Revisada" : "Marcar Revisada"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedPool(null)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

// Exportar el componente memoizado para evitar re-renders innecesarios
export const GoogleMap = memo(GoogleMapComponent)
