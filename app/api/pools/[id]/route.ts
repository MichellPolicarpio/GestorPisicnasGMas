import { NextRequest, NextResponse } from "next/server"
import type { PoolData, PoolLocation, SensorReading, EquipmentStatus, Alert } from "@/lib/types/pool"

// Mock data for a specific pool
const mockPoolData: PoolData = {
  pool: {
    id: "pool-001",
    name: "Residencial Las Palmas - Piscina Principal",
    address: "Av. Las Palmas 123, Veracruz, Ver.",
    coordinates: { lat: 19.1738, lng: -96.1342 },
    type: "residential",
    status: "active",
    clientId: "client-001",
    installDate: "2023-01-15",
  },
  currentSensors: {
    timestamp: new Date().toISOString(),
    temperature: 26.5,
    ph: 7.2,
    chlorine: 2.1,
    turbidity: 0.8,
    waterLevel: 1.2,
    oxygenLevel: 8.5,
    alkalinity: 120,
    conductivity: 1500,
  },
  equipment: {
    pumpStatus: true,
    heaterStatus: false,
    lightStatus: true,
    filterStatus: true,
    uvStatus: false,
    pumpSpeed: 75,
    heaterTemperature: 0,
    lastMaintenance: "2024-01-15",
  },
  alerts: [
    {
      id: "alert-001",
      type: "info",
      message: "Mantenimiento programado para el próximo lunes",
      timestamp: new Date().toISOString(),
      resolved: false,
      priority: "low",
    },
  ],
  lastUpdated: new Date().toISOString(),
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poolId = params.id

    // Simulate different pool data based on ID
    const poolData = {
      ...mockPoolData,
      pool: {
        ...mockPoolData.pool,
        id: poolId,
        name: `Pool ${poolId.toUpperCase()}`,
      },
    }

    return NextResponse.json(poolData)
  } catch (error) {
    console.error("Error fetching pool data:", error)
    return NextResponse.json({ error: "Failed to fetch pool data" }, { status: 500 })
  }
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'