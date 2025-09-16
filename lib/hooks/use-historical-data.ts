"use client"

import { useState, useEffect, useCallback } from "react"
import type { HistoricalData } from "@/lib/types/pool"

interface UseHistoricalDataOptions {
  poolId: string
  hours?: number
  refreshInterval?: number
}

interface UseHistoricalDataReturn {
  data: HistoricalData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useHistoricalData({
  poolId,
  hours = 24,
  refreshInterval = 300000, // 5 minutes
}: UseHistoricalDataOptions): UseHistoricalDataReturn {
  const [data, setData] = useState<HistoricalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistoricalData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/pools/${poolId}/sensors?hours=${hours}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch historical data: ${response.statusText}`)
      }

      const historicalData = await response.json()
      setData(historicalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch historical data")
      console.error("Error fetching historical data:", err)
    } finally {
      setLoading(false)
    }
  }, [poolId, hours])

  const refetch = useCallback(() => {
    fetchHistoricalData()
  }, [fetchHistoricalData])

  useEffect(() => {
    fetchHistoricalData()

    const interval = setInterval(fetchHistoricalData, refreshInterval)
    return () => clearInterval(interval)
  }, [fetchHistoricalData, refreshInterval])

  return {
    data,
    loading,
    error,
    refetch,
  }
}
