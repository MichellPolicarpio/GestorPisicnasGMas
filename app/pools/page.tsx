"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { GoogleMap } from "@/components/maps/google-map"
import { usePools } from "@/lib/contexts/pools-context"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { downloadPoolPDF } from "@/lib/utils/pdf-generator"

const GOOGLE_MAPS_API_KEY = "AIzaSyCZNbaJPL33NYGfwgTBO1DXzMh9nfhQc28"

export default function PoolsPage() {
  const { pools } = usePools()
  const searchParams = useSearchParams()
  const [centerPoolId, setCenterPoolId] = useState<string | null>(null)

  useEffect(() => {
    const poolId = searchParams.get('pool')
    if (poolId) {
      setCenterPoolId(poolId)
    }
  }, [searchParams])

  const handlePrintPDF = () => {
    if (centerPoolId) {
      const pool = pools.find(p => p.description === centerPoolId)
      if (pool) {
        const poolData = {
          id: pool.description,
          lat: pool.lat,
          lon: pool.lon,
          description: pool.description,
          captured: pool.captured,
          owner: pool.owner,
          consumptionType: pool.consumptionType,
          notes: pool.notes,
          lastUpdated: pool.lastUpdated
        }
        downloadPoolPDF(poolData)
      }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Mapa de Piscinas</h1>
              <p className="text-muted-foreground">Visualización completa de todas las piscinas identificadas en la ciudad</p>
              {centerPoolId && (
                <div className="mt-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-yellow-800">
                      ⭐ Piscina Destacada: <strong>{centerPoolId}</strong>
                    </p>
                    <div className="ml-auto flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handlePrintPDF}
                        className="bg-white hover:bg-yellow-100 border-yellow-300 text-yellow-800"
                      >
                        <Printer className="h-3 w-3 mr-1" />
                        Imprimir PDF
                      </Button>
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                        Marcador Dorado
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="h-[calc(100vh-200px)] bg-card rounded-lg border border-border overflow-hidden">
              <GoogleMap pools={pools} apiKey={GOOGLE_MAPS_API_KEY} centerPoolId={centerPoolId} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
