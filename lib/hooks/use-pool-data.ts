"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { PoolData, EquipmentStatus } from "@/lib/types/pool"

interface UsePoolDataOptions {
  poolId: string
  enableRealtime?: boolean
  pollingInterval?: number
}

interface UsePoolDataReturn {
  data: PoolData | null
  loading: boolean
  error: string | null
  connected: boolean
  reconnect: () => void
  updateEquipment: (equipment: Partial<EquipmentStatus>) => Promise<void>
}

export function usePoolData({
  poolId,
  enableRealtime = true,
  pollingInterval = 5000,
}: UsePoolDataOptions): UsePoolDataReturn {
  const [data, setData] = useState<PoolData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch initial pool data
  const fetchPoolData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/pools/${poolId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch pool data: ${response.statusText}`)
      }

      const poolData = await response.json()
      setData(poolData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch pool data")
      console.error("Error fetching pool data:", err)
    } finally {
      setLoading(false)
    }
  }, [poolId])

  // WebSocket connection for real-time updates
  const connectWebSocket = useCallback(() => {
    if (!enableRealtime || typeof window === 'undefined') return

    try {
      const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/pools/${poolId}/realtime`
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log("WebSocket connected for pool:", poolId)
        setConnected(true)
        setError(null)

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data)

          setData((prevData) => {
            if (!prevData) return prevData

            return {
              ...prevData,
              currentSensors: update.sensors || prevData.currentSensors,
              equipment: update.equipment || prevData.equipment,
              alerts: update.alerts || prevData.alerts,
              lastUpdated: new Date().toISOString(),
            }
          })
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
        }
      }

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected for pool:", poolId)
        setConnected(false)

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, 3000)
      }

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError("Real-time connection failed")
        setConnected(false)
      }
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err)
      setError("Failed to establish real-time connection")
    }
  }, [poolId, enableRealtime])

  // Polling fallback for when WebSocket is not available
  const startPolling = useCallback(() => {
    if (enableRealtime && connected) return // Don't poll if WebSocket is connected

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/pools/${poolId}/sensors`)
        if (response.ok) {
          const sensorData = await response.json()

          setData((prevData) => {
            if (!prevData) return prevData

            return {
              ...prevData,
              currentSensors: sensorData.sensors,
              equipment: sensorData.equipment,
              lastUpdated: new Date().toISOString(),
            }
          })
        }
      } catch (err) {
        console.error("Polling error:", err)
      }
    }, pollingInterval)
  }, [poolId, pollingInterval, enableRealtime, connected])

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    connectWebSocket()
  }, [connectWebSocket])

  // Update equipment status
  const updateEquipment = useCallback(
    async (equipment: Partial<EquipmentStatus>) => {
      try {
        const response = await fetch(`/api/pools/${poolId}/equipment`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(equipment),
        })

        if (!response.ok) {
          throw new Error("Failed to update equipment")
        }

        const updatedData = await response.json()

        setData((prevData) => {
          if (!prevData) return prevData

          return {
            ...prevData,
            equipment: { ...prevData.equipment, ...updatedData.equipment },
            lastUpdated: new Date().toISOString(),
          }
        })
      } catch (err) {
        console.error("Error updating equipment:", err)
        throw err
      }
    },
    [poolId],
  )

  // Initialize data fetching and connections
  useEffect(() => {
    fetchPoolData()
  }, [fetchPoolData])

  useEffect(() => {
    if (enableRealtime) {
      connectWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectWebSocket, enableRealtime])

  useEffect(() => {
    startPolling()

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [startPolling])

  return {
    data,
    loading,
    error,
    connected,
    reconnect,
    updateEquipment,
  }
}
