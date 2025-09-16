"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import Image from "next/image"
import { isSupabaseConfigured as supaConfigured } from "@/lib/supabase"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { login, loading } = useAuth()
  const isSupabaseConfigured = supaConfigured

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      console.log('✅ Login successful, redirecting to dashboard...')
      router.push("/")
    } else {
      setError("Credenciales inválidas. Intenta nuevamente.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg bg-white border-0">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src="/logo-gmas.png"
              alt="Grupo MAs Agua"
              width={200}
              height={80}
              className="mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Sistema de Piscinas
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@masagua.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Iniciando sesión...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </>
            )}
          </Button>

        </form>

        {!isSupabaseConfigured && (
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Modo demo activo</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Configura Supabase en tu archivo .env.local para usar tus credenciales reales.</p>
              <p className="mt-2 font-medium">Accesos de prueba:</p>
              <p><strong>Usuario:</strong> admin@masagua.com — <strong>Contraseña:</strong> admin123</p>
              <p><strong>Usuario:</strong> operador@masagua.com — <strong>Contraseña:</strong> operador123</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

