import dynamicImport from "next/dynamic"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

// Dynamic import to avoid SSR issues with Three.js
const Pool3DViewer = dynamicImport(() => import("@/components/pool/pool-3d-viewer").then(mod => ({ default: mod.Pool3DViewer })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Cargando visualización 3D...</p>
      </div>
    </div>
  )
})

export default function Pool3DPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-hidden">
          <div className="h-full">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-foreground">Visualización 3D de Piscina</h1>
              <p className="text-muted-foreground">
                Monitoreo en tiempo real con visualización tridimensional interactiva
              </p>
            </div>

            <div className="h-[calc(100%-5rem)]">
              <Pool3DViewer />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic'
