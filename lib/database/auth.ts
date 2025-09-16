import { supabase } from '../supabase'
import type { Database } from './types'

type User = Database['public']['Tables']['users']['Row']

export class AuthService {
  // Iniciar sesión con email y contraseña
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'No se pudo obtener la información del usuario' }
      }

      // Crear objeto de usuario básico desde auth.users
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        role: data.user.user_metadata?.role || 'viewer',
        avatar_url: data.user.user_metadata?.avatar_url || null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at
      }

      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error: 'Error inesperado al iniciar sesión' }
    }
  }

  // Cerrar sesión
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut()
      return { error: error?.message || null }
    } catch (error) {
      return { error: 'Error al cerrar sesión' }
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        return { user: null, error: null }
      }

      // Crear objeto de usuario básico desde auth.users
      const userData: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
        role: authUser.user_metadata?.role || 'viewer',
        avatar_url: authUser.user_metadata?.avatar_url || null,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at
      }

      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error: 'Error al obtener el usuario actual' }
    }
  }

  // Registrar nuevo usuario
  static async signUp(email: string, password: string, name: string, role: 'admin' | 'operator' | 'viewer'): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'No se pudo crear el usuario' }
      }

      // Crear objeto de usuario básico desde auth.users
      const userData: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: role,
        avatar_url: null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at
      }

      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error: 'Error inesperado al registrar usuario' }
    }
  }

  // Escuchar cambios en la autenticación
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Crear objeto de usuario básico desde auth.users
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuario',
          role: session.user.user_metadata?.role || 'viewer',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at
        }
        
        callback(userData)
      } else {
        callback(null)
      }
    })
  }
}
