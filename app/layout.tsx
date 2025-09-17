import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { PoolsProvider } from "@/lib/contexts/pools-context"
import { AuthProvider } from "@/lib/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Grupo Mas Agua - Sistema de Piscinas",
  description: "Sistema de visualización de piscinas para Grupo Mas Agua de Veracruz",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} h-full`}>
        <AuthProvider>
          <PoolsProvider>
            <div className="min-h-full flex flex-col">
              <Suspense fallback={null}>{children}</Suspense>
            </div>
            <Analytics />
          </PoolsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
