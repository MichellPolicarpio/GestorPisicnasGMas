import { NextRequest, NextResponse } from "next/server"
import type { EquipmentStatus } from "@/lib/types/pool"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poolId = params.id
    const equipmentUpdate = await request.json()

    // Simulate equipment update
    const updatedEquipment: EquipmentStatus = {
      pumpStatus: equipmentUpdate.pumpStatus ?? true,
      heaterStatus: equipmentUpdate.heaterStatus ?? false,
      lightStatus: equipmentUpdate.lightStatus ?? true,
      filterStatus: equipmentUpdate.filterStatus ?? true,
      uvStatus: equipmentUpdate.uvStatus ?? false,
      pumpSpeed: equipmentUpdate.pumpSpeed ?? 75,
      heaterTemperature: equipmentUpdate.heaterTemperature ?? 0,
      lastMaintenance: "2024-01-15",
    }

    return NextResponse.json({
      equipment: updatedEquipment,
      message: "Equipment updated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error updating equipment:", error)
    return NextResponse.json({ error: "Failed to update equipment" }, { status: 500 })
  }
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'