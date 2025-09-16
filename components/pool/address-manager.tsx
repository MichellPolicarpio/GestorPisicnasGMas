"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Download, Loader2, CheckCircle, AlertCircle, RefreshCw, Trash2 } from "lucide-react"
import { usePools } from "@/lib/contexts/pools-context"

interface AddressManagerProps {
  poolId?: string // Si se proporciona, solo gestiona esa piscina
  showBatchActions?: boolean // Si mostrar acciones en lote
}

export function AddressManager({ poolId, showBatchActions = true }: AddressManagerProps) {
  const { pools, fetchAddressForPool, fetchAddressForAllPools, clearPoolAddress } = usePools()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPool, setCurrentPool] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // Filtrar piscinas si se especifica un poolId
  const targetPools = poolId ? pools.filter(p => p.description === poolId) : pools

  // Estadísticas
  const stats = {
    total: targetPools.length,
    withAddress: targetPools.filter(p => p.addressInfo).length,
    withoutAddress: targetPools.filter(p => !p.addressInfo).length,
    outdated: targetPools.filter(p => {
      if (!p.addressLastFetched) return false
      const lastFetched = new Date(p.addressLastFetched)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return lastFetched < thirtyDaysAgo
    }).length
  }

  const handleFetchSingle = async (id: string) => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      const success = await fetchAddressForPool(id)
      if (success) {
        setMessage({ type: 'success', text: `✅ Dirección obtenida para ${id}` })
      } else {
        setMessage({ type: 'error', text: `❌ Error obteniendo dirección para ${id}` })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error inesperado' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFetchAll = async () => {
    setIsLoading(true)
    setProgress(0)
    setCurrentPool('')
    setMessage(null)
    
    try {
      const updatedCount = await fetchAddressForAllPools((current, total, id) => {
        setProgress((current / total) * 100)
        setCurrentPool(id)
      })
      
      setMessage({ 
        type: 'success', 
        text: `✅ Geocoding completado: ${updatedCount} direcciones actualizadas` 
      })
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error en geocoding masivo' })
    } finally {
      setIsLoading(false)
      setProgress(0)
      setCurrentPool('')
    }
  }

  const handleClearAddress = (id: string) => {
    clearPoolAddress(id)
    setMessage({ type: 'info', text: `🗑️ Dirección eliminada para ${id}` })
  }

  if (poolId && targetPools.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Piscina no encontrada: {poolId}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas - Solo mostrar en modo completo (no cuando es poolId específico) */}
      {!poolId && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Gestión de Direcciones
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.withAddress}</p>
              <p className="text-sm text-muted-foreground">Con Dirección</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.withoutAddress}</p>
              <p className="text-sm text-muted-foreground">Sin Dirección</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.outdated}</p>
              <p className="text-sm text-muted-foreground">Desactualizadas</p>
            </div>
          </div>
        </Card>
      )}

      {/* Acciones en lote */}
      {showBatchActions && !poolId && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Acciones en Lote</h4>
          <div className="flex gap-2">
            <Button 
              onClick={handleFetchAll}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Obteniendo Direcciones...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Obtener Todas las Direcciones
                </>
              )}
            </Button>
          </div>
          
          {isLoading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso:</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
              {currentPool && (
                <p className="text-sm text-muted-foreground">
                  Procesando: {currentPool}
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Mensajes */}
      {message && (
        <Alert className={
          message.type === 'success' ? 'border-green-200 bg-green-50' :
          message.type === 'error' ? 'border-red-200 bg-red-50' :
          'border-blue-200 bg-blue-50'
        }>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
           message.type === 'error' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
           <AlertCircle className="h-4 w-4 text-blue-600" />}
          <AlertDescription className={
            message.type === 'success' ? 'text-green-800' :
            message.type === 'error' ? 'text-red-800' :
            'text-blue-800'
          }>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de piscinas */}
      <div className="space-y-3">
        {targetPools.slice(0, poolId ? 1 : 50).map((pool) => (
          <div key={pool.description} className={poolId ? "space-y-3" : "flex items-center justify-between p-3 bg-muted rounded-lg"}>
            {poolId ? (
              // Vista simplificada para piscina individual
              <div className="space-y-3">
                {pool.addressInfo ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800">✅ Con Dirección</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>📍 Dirección:</strong> {pool.addressInfo.formattedAddress}</p>
                      {pool.addressInfo.neighborhood && (
                        <p><strong>🏘️ Colonia:</strong> {pool.addressInfo.neighborhood}</p>
                      )}
                      {pool.addressInfo.postalCode && (
                        <p><strong>📮 CP:</strong> {pool.addressInfo.postalCode}</p>
                      )}
                      {pool.addressLastFetched && (
                        <p><strong>📅 Actualizada:</strong> {new Date(pool.addressLastFetched).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="destructive">⏳ Sin Dirección</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      📌 Coordenadas: {pool.lat.toFixed(6)}, {pool.lon.toFixed(6)}
                    </p>
                  </div>
                )}
                
                {/* Botones siempre visibles para piscina individual */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleFetchSingle(pool.description)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        Obteniendo...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2" />
                        {pool.addressInfo ? 'Actualizar Dirección' : 'Obtener Dirección'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleClearAddress(pool.description)}
                    disabled={isLoading || !pool.addressInfo}
                    title="Eliminar dirección"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              // Vista original para lista completa
              <>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{pool.description}</span>
                    {pool.addressInfo ? (
                      <Badge className="bg-green-100 text-green-800">Con Dirección</Badge>
                    ) : (
                      <Badge variant="destructive">Sin Dirección</Badge>
                    )}
                  </div>
                  
                  {pool.addressInfo ? (
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Dirección:</strong> {pool.addressInfo.formattedAddress}</p>
                      {pool.addressInfo.neighborhood && (
                        <p><strong>Colonia:</strong> {pool.addressInfo.neighborhood}</p>
                      )}
                      {pool.addressInfo.postalCode && (
                        <p><strong>CP:</strong> {pool.addressInfo.postalCode}</p>
                      )}
                      {pool.addressLastFetched && (
                        <p><strong>Actualizada:</strong> {new Date(pool.addressLastFetched).toLocaleDateString()}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Coordenadas: {pool.lat.toFixed(6)}, {pool.lon.toFixed(6)}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFetchSingle(pool.description)}
                    disabled={isLoading}
                    title="Obtener/Actualizar dirección"
                  >
                    <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  {pool.addressInfo && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleClearAddress(pool.description)}
                      disabled={isLoading}
                      title="Eliminar dirección"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        
        {!poolId && targetPools.length > 50 && (
          <p className="text-sm text-muted-foreground text-center">
            Mostrando las primeras 50 piscinas de {targetPools.length} total
          </p>
        )}
      </div>
    </div>
  )
}
