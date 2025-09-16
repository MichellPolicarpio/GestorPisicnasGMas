"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { AuthService } from "@/lib/database/auth"
import type { Database } from "@/lib/database/types"
import { isSupabaseConfigured as supaConfigured } from "@/lib/supabase"

type User = Database['public']['Tables']['users']['Row']

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthContext - isSupabaseConfigured:', supaConfigured)
    if (supaConfigured) {
      // Verificar usuario actual al cargar
      checkCurrentUser()

      // Escuchar cambios en la autenticación
      const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
        console.log('AuthContext - Supabase auth state change:', user)
        setUser(user)
        setLoading(false)
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      // Modo fallback: verificar localStorage
      console.log('AuthContext - Using fallback mode')
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        try {
          console.log('AuthContext - Found saved user:', savedUser)
          const userData = JSON.parse(savedUser)
          setUser(userData)
        } catch (error) {
          console.error('Error parsing saved user:', error)
          localStorage.removeItem("user")
          setUser(null)
        }
      } else {
        console.log('AuthContext - No saved user found')
        setUser(null)
      }
      setLoading(false)
    }
  }, [])

  const checkCurrentUser = async () => {
    try {
      const { user: currentUser, error } = await AuthService.getCurrentUser()
      if (error) {
        console.error('Error getting current user:', error)
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Error checking current user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('Login attempt:', { email, password: '***' })
    setLoading(true)

    if (supaConfigured) {
      try {
        console.log('Calling AuthService.signIn...')
        const { user: userData, error } = await AuthService.signIn(email, password)

        console.log('AuthService result:', { userData, error })

        if (error) {
          console.error('Login error:', error)
          setLoading(false)
          return { success: false, error }
        }

        if (userData) {
          console.log('Login successful, setting user:', userData)
          setUser(userData)
          setLoading(false)
          return { success: true }
        }

        console.log('No user data returned')
        setLoading(false)
        return { success: false, error: 'No se pudo obtener la información del usuario' }
      } catch (error: any) {
        console.error('Login error:', error)
        setLoading(false)
        return { success: false, error: error?.message || 'Error inesperado al iniciar sesión' }
      }
    } else {
      // Modo fallback: credenciales de prueba
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (email === "admin@masagua.com" && password === "admin123") {
        const userData: User = {
          id: "1",
          email: "admin@masagua.com",
          name: "Administrador",
          role: "admin",
          avatar_url: "/placeholder-user.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setLoading(false)
        return { success: true }
      }

      if (email === "operador@masagua.com" && password === "operador123") {
        const userData: User = {
          id: "2",
          email: "operador@masagua.com",
          name: "Operador",
          role: "operator",
          avatar_url: "/placeholder-user.jpg",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setLoading(false)
        return { success: true }
      }

      setLoading(false)
      return { success: false, error: 'Credenciales inválidas (modo demo)' }
    }
  }

  const logout = async () => {
    setLoading(true)

    if (supaConfigured) {
      try {
        const { error } = await AuthService.signOut()
        if (error) {
          console.error('Logout error:', error)
        }
        setUser(null)
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        setLoading(false)
      }
    } else {
      // Modo fallback: limpiar localStorage
      setUser(null)
      localStorage.removeItem("user")
      setLoading(false)
    }
  }


  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

