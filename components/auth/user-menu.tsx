"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  HelpCircle,
  Info,
  LogOut,
  User,
  LayoutDashboard,
  MapPinned,
  BarChart3,
  SlidersHorizontal,
  GraduationCap,
  Code,
  Rocket,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

const getInitials = (name?: string | null, email?: string | null) => {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  if (email && email.length > 0) {
    return email[0]?.toUpperCase() ?? "U"
  }

  return "U"
}

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const displayName = user?.name ?? "Usuario invitado"
  const displayEmail = user?.email ?? "Sin sesión activa"
  const initials = getInitials(user?.name, user?.email)

  const helpSections = useMemo(
    () => [
      {
        title: "Panel principal",
        description: "Indicadores al instante, accesos rápidos y recordatorios clave para iniciar la jornada.",
        icon: LayoutDashboard,
        accent: "from-primary/10 to-primary/0 text-primary",
      },
      {
        title: "Mapa y estado de piscinas",
        description: "Ubica cada piscina, actualiza su estatus y consulta direcciones enriquecidas en segundos.",
        icon: MapPinned,
        accent: "from-sky-200/40 to-sky-200/0 text-sky-600",
      },
      {
        title: "Reportes y métricas",
        description: "Genera PDF listos para compartir, analiza tendencias y monitorea el cumplimiento de inspecciones.",
        icon: BarChart3,
        accent: "from-amber-200/50 to-amber-200/0 text-amber-600",
      },
      {
        title: "Configuración",
        description: "Administra usuarios, parámetros operativos y mantén alineada la experiencia del equipo.",
        icon: SlidersHorizontal,
        accent: "from-emerald-200/50 to-emerald-200/0 text-emerald-600",
      },
    ],
    [],
  )

  return (
    <>
      <div className="relative" ref={containerRef}>
        <Button
          variant="outline"
          size="icon"
        className="bg-transparent"
        aria-label="Menú de usuario"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.avatar_url ?? undefined} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
          <div className="flex items-start gap-3 border-b border-border bg-muted/40 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar_url ?? undefined} alt={displayName} />
              <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{displayName}</span>
              <span className="text-xs text-muted-foreground">{displayEmail}</span>
            </div>
          </div>

          <div className="space-y-1 p-2">
            <Button variant="ghost" size="sm" className="w-full justify-start" disabled>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setIsOpen(false)
                setIsHelpOpen(true)
              }}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Ayuda
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setIsOpen(false)
                setIsAboutOpen(true)
              }}
            >
              <Info className="mr-2 h-4 w-4" />
              Acerca de
            </Button>
          </div>

          <Separator className="my-1" />

          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive"
              onClick={async () => {
                setIsOpen(false)
                await logout()
                router.push("/login")
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
      </div>

      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Qué puedes hacer aquí?</DialogTitle>
            <DialogDescription>
              Un sistema integral para que Grupo Mas Agua administre el ciclo completo de inspecciones, ubicaciones y reportes de piscinas.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 text-sm text-muted-foreground">
            {helpSections.map((section) => {
              const Icon = section.icon
              return (
                <div
                  key={section.title}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${section.accent} opacity-70 transition-opacity duration-200 group-hover:opacity-100`}
                  />
                  <div className="relative flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{section.title}</p>
                      <p>{section.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsHelpOpen(false)}>Entendido</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acerca de este proyecto</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 text-sm text-muted-foreground">
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/15 via-background to-background p-5 text-foreground shadow-sm">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary"><Sparkles className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Prototipo 1.0</p>
                  <p className="text-xs text-muted-foreground">Diseñado para validar el flujo operativo interno</p>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Una herramienta experimental que evoluciona con la retroalimentación del equipo de Grupo Mas Agua.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-4">
              <div className="flex items-center gap-3 text-foreground">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-muted/60"><GraduationCap className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-semibold">Autor</p>
                  <p className="text-xs text-muted-foreground">Becario de Grupo Mas Agua · Ingeniería Informática · UV</p>
                </div>
              </div>
              <p className="mt-3">
                Desarrollado por <span className="font-medium text-foreground">Michell Alexis Policarpio Moran</span>, integrando necesidades reales del equipo con prácticas modernas de desarrollo.
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-3 text-foreground">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-muted/70"><Code className="h-5 w-5" /></span>
                <div>
                  <p className="text-sm font-semibold">Tecnologías clave</p>
                  <p className="text-xs text-muted-foreground">Stack moderno orientado a velocidad e iteración</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1"><Rocket className="h-3 w-3" /> Next.js</Badge>
                <Badge variant="secondary" className="gap-1"><Rocket className="h-3 w-3" /> Vercel</Badge>
                <Badge variant="secondary" className="gap-1"><Rocket className="h-3 w-3" /> Supabase</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAboutOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
