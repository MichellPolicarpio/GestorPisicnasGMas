// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'operator' | 'viewer'
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'operator' | 'viewer'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'operator' | 'viewer'
          avatar_url?: string
          updated_at?: string
        }
      }
      pools: {
        Row: {
          id: string
          description: string
          lat: number
          lon: number
          owner?: string
          consumption_type?: 'residencial' | 'comercial' | 'industrial' | 'publico'
          status: 'active' | 'maintenance' | 'inactive'
          captured: boolean
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          lat: number
          lon: number
          owner?: string
          consumption_type?: 'residencial' | 'comercial' | 'industrial' | 'publico'
          status?: 'active' | 'maintenance' | 'inactive'
          captured?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          lat?: number
          lon?: number
          owner?: string
          consumption_type?: 'residencial' | 'comercial' | 'industrial' | 'publico'
          status?: 'active' | 'maintenance' | 'inactive'
          captured?: boolean
          notes?: string
          updated_at?: string
        }
      }
      pool_sensors: {
        Row: {
          id: string
          pool_id: string
          temperature: number
          ph: number
          chlorine: number
          turbidity: number
          water_level: number
          oxygen_level: number
          alkalinity: number
          conductivity: number
          timestamp: string
        }
        Insert: {
          id?: string
          pool_id: string
          temperature: number
          ph: number
          chlorine: number
          turbidity: number
          water_level: number
          oxygen_level: number
          alkalinity: number
          conductivity: number
          timestamp?: string
        }
        Update: {
          id?: string
          pool_id?: string
          temperature?: number
          ph?: number
          chlorine?: number
          turbidity?: number
          water_level?: number
          oxygen_level?: number
          alkalinity?: number
          conductivity?: number
          timestamp?: string
        }
      }
      pool_equipment: {
        Row: {
          id: string
          pool_id: string
          pump_status: boolean
          heater_status: boolean
          light_status: boolean
          filter_status: boolean
          uv_status: boolean
          pump_speed: number
          heater_temperature: number
          last_maintenance: string
          updated_at: string
        }
        Insert: {
          id?: string
          pool_id: string
          pump_status?: boolean
          heater_status?: boolean
          light_status?: boolean
          filter_status?: boolean
          uv_status?: boolean
          pump_speed?: number
          heater_temperature?: number
          last_maintenance?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pool_id?: string
          pump_status?: boolean
          heater_status?: boolean
          light_status?: boolean
          filter_status?: boolean
          uv_status?: boolean
          pump_speed?: number
          heater_temperature?: number
          last_maintenance?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
