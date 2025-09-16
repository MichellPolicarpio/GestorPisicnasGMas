import { AnalyticsCharts } from "@/components/pool/analytics-charts"
import { AnalyticsInsights } from "@/components/pool/analytics-insights"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Análisis y Tendencias</h1>
              <p className="text-muted-foreground">Análisis detallado de datos históricos y tendencias de la piscina</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Charts - Takes up 3/4 of the space */}
              <div className="xl:col-span-3">
                <AnalyticsCharts poolId="pool-001" />
              </div>

              {/* Insights - Takes up 1/4 of the space */}
              <div className="xl:col-span-1">
                <AnalyticsInsights poolId="pool-001" />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
