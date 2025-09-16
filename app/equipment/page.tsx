import { EquipmentControlPanel } from "@/components/pool/equipment-control-panel"
import { RealTimeStatus } from "@/components/pool/real-time-status"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function EquipmentPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Control de Equipos</h1>
              <p className="text-muted-foreground">
                Gestiona y monitorea todos los equipos de la piscina en tiempo real
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Equipment Controls - Takes up 2/3 of the space */}
              <div className="lg:col-span-2">
                <EquipmentControlPanel poolId="pool-001" />
              </div>

              {/* Real-time Status - Takes up 1/3 of the space */}
              <div className="lg:col-span-1">
                <RealTimeStatus poolId="pool-001" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
