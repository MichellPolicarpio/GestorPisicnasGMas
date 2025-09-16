import { supabase } from '../supabase'
import type { Database } from './types'

type Pool = Database['public']['Tables']['pools']['Row']
type PoolInsert = Database['public']['Tables']['pools']['Insert']
type PoolUpdate = Database['public']['Tables']['pools']['Update']

export class PoolsService {
  // Obtener todas las piscinas
  static async getAllPools(): Promise<Pool[]> {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pools:', error)
      throw error
    }

    return data || []
  }

  // Obtener una piscina por ID
  static async getPoolById(id: string): Promise<Pool | null> {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching pool:', error)
      return null
    }

    return data
  }

  // Crear una nueva piscina
  static async createPool(pool: PoolInsert): Promise<Pool> {
    const { data, error } = await supabase
      .from('pools')
      .insert(pool)
      .select()
      .single()

    if (error) {
      console.error('Error creating pool:', error)
      throw error
    }

    return data
  }

  // Actualizar una piscina
  static async updatePool(id: string, updates: PoolUpdate): Promise<Pool> {
    const { data, error } = await supabase
      .from('pools')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating pool:', error)
      throw error
    }

    return data
  }

  // Eliminar una piscina
  static async deletePool(id: string): Promise<void> {
    const { error } = await supabase
      .from('pools')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting pool:', error)
      throw error
    }
  }

  // Obtener piscinas por estado
  static async getPoolsByStatus(status: string): Promise<Pool[]> {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pools by status:', error)
      throw error
    }

    return data || []
  }

  // Obtener piscinas por tipo de consumo
  static async getPoolsByConsumptionType(consumptionType: string): Promise<Pool[]> {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .eq('consumption_type', consumptionType)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching pools by consumption type:', error)
      throw error
    }

    return data || []
  }
}
