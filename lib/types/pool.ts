// Pool and sensor data type definitions
import { AddressInfo } from '../services/geocoding'

export interface PoolLocation {
  id: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  // Nueva información de dirección detallada
  addressInfo?: AddressInfo
  type: "residential" | "commercial" | "public"
  status: "active" | "maintenance" | "inactive"
  clientId: string
  installDate: string
}

// Extender la interfaz existente del contexto
export interface ExtendedPoolLocation {
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
  addressLastFetched?: string // Timestamp de cuando se obtuvo la dirección
}

export interface SensorReading {
  timestamp: string
  temperature: number
  ph: number
  chlorine: number
  turbidity: number
  waterLevel: number
  oxygenLevel: number
  alkalinity: number
  conductivity: number
}

export interface EquipmentStatus {
  pumpStatus: boolean
  heaterStatus: boolean
  lightStatus: boolean
  filterStatus: boolean
  uvStatus: boolean
  pumpSpeed: number
  heaterTemperature: number
  lastMaintenance: string
}

export interface PoolData {
  pool: PoolLocation
  currentSensors: SensorReading
  equipment: EquipmentStatus
  alerts: Alert[]
  lastUpdated: string
}

export interface Alert {
  id: string
  type: "warning" | "error" | "info"
  message: string
  timestamp: string
  resolved: boolean
  priority: "low" | "medium" | "high" | "critical"
}

export interface HistoricalData {
  poolId: string
  readings: SensorReading[]
  timeRange: {
    start: string
    end: string
  }
}
