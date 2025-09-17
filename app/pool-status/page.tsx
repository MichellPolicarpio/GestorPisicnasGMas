"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, Search, Filter, Plus, Edit, Trash2, MapPin, ExternalLink, Printer, RefreshCw, X } from "lucide-react"
import { useState, useMemo, useCallback, useEffect, memo } from "react"
import { usePools } from "@/lib/contexts/pools-context"
import { downloadPoolPDF } from "@/lib/utils/pdf-generator"
import { GoogleMap } from "@/components/maps/google-map"
import { AddressManager } from "@/components/pool/address-manager"
import Link from "next/link"

interface PoolStatus {
  id: string
  description: string
  lat: number
  lon: number
  status: "revisada" | "no-revisada"
  owner?: string
  consumptionType?: "residencial" | "comercial" | "industrial" | "publico"
  notes?: string
  lastUpdated: string
}

// Componente memoizado para el formulario de edición
const PoolEditForm = memo(({ 
  pool, 
  onSave, 
  onCancel 
}: { 
  pool: PoolStatus
  onSave: (updates: Partial<PoolStatus>) => void
  onCancel: () => void
}) => {
  const [localOwner, setLocalOwner] = useState(pool.owner || "")
  const [localConsumptionType, setLocalConsumptionType] = useState(pool.consumptionType || "")
  const [localStatus, setLocalStatus] = useState<"revisada" | "no-revisada">(pool.status)
  const [localNotes, setLocalNotes] = useState(pool.notes || "")

  const handleSave = useCallback(() => {
    onSave({
      owner: localOwner,
      consumptionType: localConsumptionType as any,
      status: localStatus,
      notes: localNotes
    })
  }, [localOwner, localConsumptionType, localStatus, localNotes, onSave])

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-6 px-5 py-4">
        <section className="rounded-lg border border-border/60 bg-card/40 p-4 shadow-sm">
          <h4 className="text-md font-semibold mb-4">📊 Información Básica</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Propietario</label>
              <Input
                value={localOwner}
                onChange={(e) => setLocalOwner(e.target.value)}
                placeholder="Nombre del propietario"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Modalidad de Consumo</label>
              <Select 
                value={localConsumptionType} 
                onValueChange={setLocalConsumptionType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residencial">Residencial</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="publico">Público</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Estatus</label>
              <Select 
                value={localStatus} 
                onValueChange={(value) => setLocalStatus(value as "revisada" | "no-revisada")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revisada">Revisada</SelectItem>
                  <SelectItem value="no-revisada">No Revisada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Notas</label>
              <Textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Notas adicionales..."
                rows={4}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border/60 bg-card/40 p-4 shadow-sm">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            📍 Dirección
          </h4>
          <AddressManager poolId={pool.id} showBatchActions={false} />
        </section>

        <section className="rounded-lg border border-border/60 bg-muted/30 p-4">
          <h5 className="text-sm font-semibold mb-3">🌍 Coordenadas GPS</h5>
          <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div>
              <p className="font-medium text-foreground">Latitud</p>
              <p>{pool.lat.toFixed(6)}°</p>
            </div>
            <div>
              <p className="font-medium text-foreground">Longitud</p>
              <p>{pool.lon.toFixed(6)}°</p>
            </div>
            <div className="sm:col-span-2">
              <p className="font-medium text-foreground">Estado</p>
              <p>{pool.status === "revisada" ? "✅ Revisada" : "⏳ Pendiente de revisión"}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button 
            onClick={handleSave}
            className="flex-1"
          >
            💾 Guardar Cambios
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            ❌ Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
})

export default function PoolStatusPage() {
  const { pools: contextPools, updatePool, centerOnPool, fetchAddressForPool } = usePools()
  
  // Memoizar la conversión de datos para evitar recálculos innecesarios
  const pools: PoolStatus[] = useMemo(() => 
    contextPools.map(pool => ({
      id: pool.description,
      description: pool.description,
      lat: pool.lat,
      lon: pool.lon,
      status: pool.captured ? "revisada" : "no-revisada",
      owner: pool.owner,
      consumptionType: pool.consumptionType,
      notes: pool.notes,
      lastUpdated: pool.lastUpdated || new Date().toISOString().split('T')[0]
    })), [contextPools])
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPool, setSelectedPool] = useState<PoolStatus | null>(null)

  // Función para actualizar el estado de piscinas
  const updatePoolStatus = useCallback((id: string, updates: Partial<PoolStatus>) => {
    const contextUpdates: any = {}
    
    if (updates.status) {
      contextUpdates.captured = updates.status === "revisada"
    }
    if (updates.owner !== undefined) {
      contextUpdates.owner = updates.owner
    }
    if (updates.consumptionType !== undefined) {
      contextUpdates.consumptionType = updates.consumptionType
    }
    if (updates.notes !== undefined) {
      contextUpdates.notes = updates.notes
    }
    
    updatePool(id, contextUpdates)
  }, [updatePool])

  // Funciones para manejar la edición de piscinas
  const handleCancel = useCallback(() => {
    setSelectedPool(null)
  }, [])

  const handleSavePool = useCallback((updates: Partial<PoolStatus>) => {
    if (!selectedPool) return
    updatePoolStatus(selectedPool.id, updates)
    setSelectedPool(null)
  }, [selectedPool, updatePoolStatus])

  // Memoizar el array de pools para el mapa fuera del renderizado condicional
  const selectedPoolArray = useMemo(() => 
    selectedPool ? [selectedPool] : [], 
    [selectedPool?.id, selectedPool?.lat, selectedPool?.lon]
  )

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.owner?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || pool.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Memoizar la función de imprimir PDF
  const handlePrintPDF = useCallback((pool: PoolStatus) => {
    // Buscar la piscina completa en el contexto para obtener datos de dirección
    const fullPoolData = contextPools.find(p => p.description === pool.id)
    
    const poolData = {
      id: pool.id,
      lat: pool.lat,
      lon: pool.lon,
      description: pool.description,
      captured: pool.status === "revisada",
      owner: pool.owner,
      consumptionType: pool.consumptionType,
      notes: pool.notes,
      lastUpdated: pool.lastUpdated,
      // Incluir información de dirección si está disponible
      addressInfo: fullPoolData?.addressInfo,
      addressLastFetched: fullPoolData?.addressLastFetched
    }
    
    downloadPoolPDF(poolData)
  }, [contextPools])

  const stats = {
    total: pools.length,
    revisadas: pools.filter(p => p.status === "revisada").length,
    noRevisadas: pools.filter(p => p.status === "no-revisada").length,
    conPropietario: pools.filter(p => p.owner).length,
    sinPropietario: pools.filter(p => !p.owner).length
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Estatus de Piscinas</h1>
              <p className="text-muted-foreground">Gestión y seguimiento del estado de revisión de piscinas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revisadas</p>
                    <p className="text-2xl font-bold text-primary">{stats.revisadas}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">No Revisadas</p>
                    <p className="text-2xl font-bold text-destructive">{stats.noRevisadas}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Con Propietario</p>
                    <p className="text-2xl font-bold text-accent">{stats.conPropietario}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sin Propietario</p>
                    <p className="text-2xl font-bold text-muted-foreground">{stats.sinPropietario}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-muted-foreground" />
                </div>
              </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por ID o propietario..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por estatus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="revisada">Revisadas</SelectItem>
                      <SelectItem value="no-revisada">No Revisadas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </Card>

            {/* Pools Table */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Lista de Piscinas</h3>
                  <Badge variant="outline">{filteredPools.length} resultados</Badge>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">ID</th>
                        <th className="text-left p-2">Estatus</th>
                        <th className="text-left p-2">Dirección</th>
                        <th className="text-left p-2">Propietario</th>
                        <th className="text-left p-2">Modalidad</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPools.map((pool) => {
                        const poolData = contextPools.find(p => p.description === pool.id)
                        return (
                        <tr key={pool.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{pool.description}</td>
                          <td className="p-2">
                            <Badge 
                              className={pool.status === "revisada" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-destructive text-destructive-foreground"
                              }
                            >
                              {pool.status === "revisada" ? "Revisada" : "No Revisada"}
                            </Badge>
                          </td>
                          <td className="p-2 max-w-xs">
                            {poolData?.addressInfo ? (
                              <div className="space-y-1">
                                <p className="text-sm truncate" title={poolData.addressInfo.formattedAddress}>
                                  {poolData.addressInfo.formattedAddress}
                                </p>
                                {poolData.addressInfo.postalCode && (
                                  <Badge variant="outline" className="text-xs">
                                    CP: {poolData.addressInfo.postalCode}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">Sin dirección</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => fetchAddressForPool(pool.id)}
                                  title="Obtener dirección"
                                  className="h-6 w-6 p-0"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </td>
                          <td className="p-2">{pool.owner || "Sin asignar"}</td>
                          <td className="p-2">
                            {pool.consumptionType ? (
                              <Badge variant="outline">{pool.consumptionType}</Badge>
                            ) : (
                              <span className="text-muted-foreground">No definida</span>
                            )}
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedPool(pool)}
                                title="Editar piscina"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => centerOnPool(pool.id)}
                                title="Ver en el mapa"
                              >
                                <MapPin className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handlePrintPDF(pool)}
                                title="Imprimir PDF"
                              >
                                <Printer className="h-3 w-3" />
                              </Button>
                              <Link href={`/pools?pool=${pool.id}`}>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  title="Abrir mapa completo"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit Pool Modal - DISEÑO SIMPLIFICADO */}
      {selectedPool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 h-[85vh] relative">
            
            {/* Botón X para cerrar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="absolute -top-2 -right-2 z-10 bg-white hover:bg-gray-100 border border-gray-200 rounded-full h-8 w-8 p-0 shadow-md"
              title="Cerrar sin guardar"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* RECUADRO 1: Edición de Piscina + Gestión de Direcciones */}
            <Card className="flex h-full flex-col overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                  <Edit className="h-5 w-5" />
                  <span>Editar Piscina: {selectedPool.description}</span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <Button 
                    variant="outline"
                    onClick={() => handlePrintPDF(selectedPool)}
                    title="Imprimir PDF de esta piscina"
                    className="w-full sm:w-auto"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    📄 Imprimir PDF
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <PoolEditForm 
                  pool={selectedPool}
                  onSave={handleSavePool}
                  onCancel={handleCancel}
                />
              </div>
            </Card>

            {/* RECUADRO 2: Mapa - ESTÁTICO */}
            <Card className="w-full h-full flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 pb-0">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  🗺️ Ubicación de la Piscina
                </h4>
                <Button 
                  variant="outline"
                  size="sm"
                  title="Ver en el mapa completo"
                  asChild
                >
                  <Link href={`/pools?pool=${selectedPool.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Mapa Completo
                  </Link>
                </Button>
              </div>
              <div className="flex-1 px-4 pb-4">
                <div className="h-full rounded-lg overflow-hidden border">
                  <GoogleMap 
                    pools={selectedPoolArray} 
                    centerPoolId={selectedPool.id}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
