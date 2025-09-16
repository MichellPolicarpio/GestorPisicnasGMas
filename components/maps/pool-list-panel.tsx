"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Search, Eye, EyeOff, Navigation } from "lucide-react"

interface PoolLocation {
  lat: number
  lon: number
  description: string
  captured: boolean
}

interface PoolListPanelProps {
  pools: PoolLocation[]
  onPoolSelect: (pool: PoolLocation) => void
  selectedPool: PoolLocation | null
}

export function PoolListPanel({ pools, onPoolSelect, selectedPool }: PoolListPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "captured" | "pending">("all")
  const [isVisible, setIsVisible] = useState(true)

  const filteredPools = pools.filter((pool) => {
    const matchesSearch = pool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "captured" && pool.captured) ||
      (filterStatus === "pending" && !pool.captured)

    return matchesSearch && matchesFilter
  })

  const capturedCount = pools.filter((p) => p.captured).length
  const pendingCount = pools.filter((p) => !p.captured).length

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed top-20 left-4 z-20 bg-primary text-primary-foreground"
        size="sm"
      >
        <Eye className="h-4 w-4 mr-2" />
        Mostrar Lista
      </Button>
    )
  }

  return (
    <Card className="fixed top-20 left-4 w-80 h-96 z-20 bg-card/95 backdrop-blur-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Lista de Piscinas</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            <EyeOff className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar piscina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            Todas ({pools.length})
          </Button>
          <Button
            variant={filterStatus === "captured" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("captured")}
            className={filterStatus === "captured" ? "bg-primary text-primary-foreground" : ""}
          >
            Capturadas ({capturedCount})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className={filterStatus === "pending" ? "bg-destructive text-destructive-foreground" : ""}
          >
            Pendientes ({pendingCount})
          </Button>
        </div>
      </div>

      <ScrollArea className="h-64">
        <div className="p-2 space-y-2">
          {filteredPools.map((pool, index) => (
            <Card
              key={`${pool.lat}-${pool.lon}-${index}`}
              className={`p-3 cursor-pointer transition-colors hover:bg-accent/50 ${
                selectedPool === pool ? "bg-accent border-primary" : ""
              }`}
              onClick={() => onPoolSelect(pool)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{pool.description}</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Lat: {pool.lat.toFixed(6)}</p>
                    <p>Lon: {pool.lon.toFixed(6)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={pool.captured ? "default" : "destructive"}
                    className={
                      pool.captured
                        ? "bg-primary text-primary-foreground"
                        : "bg-destructive text-destructive-foreground"
                    }
                  >
                    {pool.captured ? "Capturada" : "Pendiente"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onPoolSelect(pool)
                    }}
                  >
                    <Navigation className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {filteredPools.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron piscinas</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
