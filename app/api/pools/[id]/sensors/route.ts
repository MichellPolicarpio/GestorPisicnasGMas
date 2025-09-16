import { NextRequest, NextResponse } from "next/server"
import type { SensorReading, EquipmentStatus } from "@/lib/types/pool"

// Mock sensor data
const mockSensorData = {
  sensors: {
    timestamp: new Date().toISOString(),
    temperature: 26.5 + (Math.random() - 0.5) * 2, // Add some variation
    ph: 7.2 + (Math.random() - 0.5) * 0.4,
    chlorine: 2.1 + (Math.random() - 0.5) * 0.6,
    turbidity: 0.8 + (Math.random() - 0.5) * 0.4,
    waterLevel: 1.2 + (Math.random() - 0.5) * 0.2,
    oxygenLevel: 8.5 + (Math.random() - 0.5) * 1.0,
    alkalinity: 120 + (Math.random() - 0.5) * 20,
    conductivity: 1500 + (Math.random() - 0.5) * 200,
  } as SensorReading,
  equipment: {
    pumpStatus: Math.random() > 0.1, // 90% chance of being on
    heaterStatus: Math.random() > 0.7, // 30% chance of being on
    lightStatus: Math.random() > 0.3, // 70% chance of being on
    filterStatus: Math.random() > 0.05, // 95% chance of being on
    uvStatus: Math.random() > 0.8, // 20% chance of being on
    pumpSpeed: 60 + Math.random() * 40, // Random speed between 60-100%
    heaterTemperature: Math.random() > 0.7 ? 25 + Math.random() * 10 : 0,
    lastMaintenance: "2024-01-15",
  } as EquipmentStatus,
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poolId = params.id

    // Return mock sensor data with some randomization
    return NextResponse.json(mockSensorData)
  } catch (error) {
    console.error("Error fetching sensor data:", error)
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 })
  }
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'