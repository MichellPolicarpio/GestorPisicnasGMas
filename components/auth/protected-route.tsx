"use client"

import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  console.log('ProtectedRoute - loading:', loading)
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated)
  console.log('ProtectedRoute - user:', user)

  useEffect(() => {
    console.log('ProtectedRoute - useEffect triggered', { loading, isAuthenticated })
    if (!loading && !isAuthenticated) {
      console.log('ProtectedRoute - Redirecting to login')
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  // Si está cargando, mostrar loading
  if (loading) {
    console.log('ProtectedRoute - Showing loading screen')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar loading mientras redirige
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute - Not authenticated, showing loading while redirecting')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  console.log('ProtectedRoute - User authenticated, showing children')
  return <>{children}</>
}
