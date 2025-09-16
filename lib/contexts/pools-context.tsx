"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import poolsData from '@/data/pools-coordinates.json'
import { getGeocodingService, type AddressInfo } from '@/lib/services/geocoding'

interface PoolLocation {
  lat: number
  lon: number
  description: string
  captured: boolean
  owner?: string
  consumptionType?: "residencial" | "comercial" | "industrial" | "publico"
  notes?: string
  lastUpdated?: string
  // Nueva información de dirección
  addressInfo?: AddressInfo
  addressLastFetched?: string
}

interface PoolsContextType {
  pools: PoolLocation[]
  updatePool: (id: string, updates: Partial<PoolLocation>) => void
  addPool: (pool: Omit<PoolLocation, 'lastUpdated'>) => void
  togglePoolStatus: (id: string) => void
  getPoolById: (id: string) => PoolLocation | undefined
  centerOnPool: (id: string) => void
  setCenterOnPool: (callback: (lat: number, lon: number) => void) => void
  // Nuevas funciones para geocoding
  fetchAddressForPool: (id: string) => Promise<boolean>
  fetchAddressForAllPools: (onProgress?: (current: number, total: number, id: string) => void) => Promise<number>
  clearPoolAddress: (id: string) => void
}

const PoolsContext = createContext<PoolsContextType | undefined>(undefined)

export function PoolsProvider({ children }: { children: React.ReactNode }) {
  const [pools, setPools] = useState<PoolLocation[]>(() => {
    // Inicializar siempre con datos del JSON para evitar hidratación
    // Filtrar coordenadas inválidas
    return poolsData
      .filter(pool => 
        typeof pool.lat === 'number' && typeof pool.lon === 'number' && 
        !isNaN(pool.lat) && !isNaN(pool.lon) && 
        isFinite(pool.lat) && isFinite(pool.lon) &&
        pool.lat >= -90 && pool.lat <= 90 && pool.lon >= -180 && pool.lon <= 180
      )
      .map(pool => ({
        ...pool,
        captured: false,
        lastUpdated: new Date().toISOString().split('T')[0]
      }))
  })

  // Cargar datos desde localStorage después de la hidratación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pools-data')
      if (saved) {
        try {
          const savedData = JSON.parse(saved)
          setPools(savedData)
        } catch (error) {
          console.error('Error parsing saved pools data:', error)
        }
      }
    }
  }, [])

  const [centerOnPool, setCenterOnPool] = useState<((lat: number, lon: number) => void) | null>(null)

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pools-data', JSON.stringify(pools))
    }
  }, [pools])

  const updatePool = (id: string, updates: Partial<PoolLocation>) => {
    setPools(prevPools => 
      prevPools.map(pool => 
        pool.description === id 
          ? { 
              ...pool, 
              ...updates, 
              lastUpdated: new Date().toISOString().split('T')[0] 
            }
          : pool
      )
    )
  }

  const addPool = (newPool: Omit<PoolLocation, 'lastUpdated'>) => {
    const poolWithTimestamp: PoolLocation = {
      ...newPool,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    setPools(prevPools => [...prevPools, poolWithTimestamp])
  }

  const togglePoolStatus = (id: string) => {
    setPools(prevPools => 
      prevPools.map(pool => 
        pool.description === id 
          ? { 
              ...pool, 
              captured: !pool.captured,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : pool
      )
    )
  }

  const getPoolById = (id: string) => {
    return pools.find(pool => pool.description === id)
  }

  const centerOnPoolLocation = (id: string) => {
    const pool = getPoolById(id)
    if (pool && centerOnPool) {
      // Validar coordenadas antes de centrar
      if (typeof pool.lat === 'number' && typeof pool.lon === 'number' && 
          !isNaN(pool.lat) && !isNaN(pool.lon) && 
          isFinite(pool.lat) && isFinite(pool.lon) &&
          pool.lat >= -90 && pool.lat <= 90 && pool.lon >= -180 && pool.lon <= 180) {
        centerOnPool(pool.lat, pool.lon)
      } else {
        console.error('Coordenadas inválidas para la piscina:', id, { lat: pool.lat, lon: pool.lon })
      }
    }
  }

  // Función para obtener dirección de una piscina específica
  const fetchAddressForPool = async (id: string): Promise<boolean> => {
    const pool = getPoolById(id)
    if (!pool) {
      console.error('Piscina no encontrada:', id)
      return false
    }

    try {
      console.log('🌍 Obteniendo dirección para piscina:', id)
      const geocodingService = getGeocodingService()
      const result = await geocodingService.reverseGeocode(pool.lat, pool.lon)

      if (result.success && result.data) {
        // Actualizar la piscina con la información de dirección
        updatePool(id, {
          addressInfo: result.data,
          addressLastFetched: new Date().toISOString()
        })
        console.log('✅ Dirección obtenida para', id, ':', result.data.formattedAddress)
        return true
      } else {
        console.error('❌ Error obteniendo dirección para', id, ':', result.error)
        return false
      }
    } catch (error) {
      console.error('❌ Error en fetchAddressForPool:', error)
      return false
    }
  }

  // Función para obtener direcciones de todas las piscinas
  const fetchAddressForAllPools = async (
    onProgress?: (current: number, total: number, id: string) => void
  ): Promise<number> => {
    console.log('🌍 Iniciando geocoding masivo para', pools.length, 'piscinas')
    
    // Filtrar piscinas que no tienen dirección o la tienen muy antigua (más de 30 días)
    const poolsToUpdate = pools.filter(pool => {
      if (!pool.addressInfo) return true
      if (!pool.addressLastFetched) return true
      
      const lastFetched = new Date(pool.addressLastFetched)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return lastFetched < thirtyDaysAgo
    })

    console.log('📍 Piscinas a actualizar:', poolsToUpdate.length)

    if (poolsToUpdate.length === 0) {
      console.log('✅ Todas las piscinas ya tienen direcciones actualizadas')
      return 0
    }

    // Preparar coordenadas para geocoding masivo
    const coordinates = poolsToUpdate.map(pool => ({
      lat: pool.lat,
      lng: pool.lon,
      id: pool.description
    }))

    try {
      const geocodingService = getGeocodingService()
      const results = await geocodingService.batchReverseGeocode(coordinates, onProgress)
      
      let successCount = 0
      
      // Actualizar cada piscina con su resultado
      for (const [poolId, result] of results.entries()) {
        if (result.success && result.data) {
          updatePool(poolId, {
            addressInfo: result.data,
            addressLastFetched: new Date().toISOString()
          })
          successCount++
        }
      }

      console.log('✅ Geocoding completado:', successCount, 'de', poolsToUpdate.length, 'piscinas actualizadas')
      return successCount
    } catch (error) {
      console.error('❌ Error en geocoding masivo:', error)
      return 0
    }
  }

  // Función para limpiar dirección de una piscina
  const clearPoolAddress = (id: string) => {
    updatePool(id, {
      addressInfo: undefined,
      addressLastFetched: undefined
    })
  }

  const value: PoolsContextType = {
    pools,
    updatePool,
    addPool,
    togglePoolStatus,
    getPoolById,
    centerOnPool: centerOnPoolLocation,
    setCenterOnPool,
    // Nuevas funciones de geocoding
    fetchAddressForPool,
    fetchAddressForAllPools,
    clearPoolAddress
  }

  return (
    <PoolsContext.Provider value={value}>
      {children}
    </PoolsContext.Provider>
  )
}

export function usePools() {
  const context = useContext(PoolsContext)
  if (context === undefined) {
    throw new Error('usePools must be used within a PoolsProvider')
  }
  return context
}
