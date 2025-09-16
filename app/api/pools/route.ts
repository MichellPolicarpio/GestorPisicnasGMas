import { type NextRequest, NextResponse } from "next/server"
import type { PoolLocation } from "@/lib/types/pool"

// Mock pool data - in production this would come from a database
const mockPools: PoolLocation[] = [
  {
    id: "pool-001",
    name: "Residencial Las Palmas - Piscina Principal",
    address: "Av. Las Palmas 123, Veracruz, Ver.",
    coordinates: { lat: 19.1738, lng: -96.1342 },
    type: "residential",
    status: "active",
    clientId: "client-001",
    installDate: "2023-01-15",
  },
  {
    id: "pool-002",
    name: "Hotel Costa Dorada - Piscina Olímpica",
    address: "Blvd. Costero 456, Veracruz, Ver.",
    coordinates: { lat: 19.1895, lng: -96.1531 },
    type: "commercial",
    status: "active",
    clientId: "client-002",
    installDate: "2022-08-20",
  },
  {
    id: "pool-003",
    name: "Club Deportivo Veracruz - Piscina Semi-olímpica",
    address: "Calle Deportes 789, Veracruz, Ver.",
    coordinates: { lat: 19.1654, lng: -96.1287 },
    type: "public",
    status: "maintenance",
    clientId: "client-003",
    installDate: "2023-03-10",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredPools = mockPools

    if (status) {
      filteredPools = filteredPools.filter((pool) => pool.status === status)
    }

    if (type) {
      filteredPools = filteredPools.filter((pool) => pool.type === type)
    }

    return NextResponse.json({
      pools: filteredPools,
      total: filteredPools.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching pools:", error)
    return NextResponse.json({ error: "Failed to fetch pools" }, { status: 500 })
  }
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
