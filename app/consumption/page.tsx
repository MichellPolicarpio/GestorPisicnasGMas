"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, Search, Plus, Edit, Trash2, BarChart3, TrendingUp, Users, Building2 } from "lucide-react"
import { useState } from "react"

interface ConsumptionType {
  id: string
  name: string
  description: string
  category: "residencial" | "comercial" | "industrial" | "publico"
  characteristics: string[]
  pricing: {
    base: number
    unit: string
    currency: string
  }
  requirements: string[]
  pools: number
  owners: number
}

export default function ConsumptionPage() {
  const [consumptionTypes, setConsumptionTypes] = useState<ConsumptionType[]>([
    {
      id: "1",
      name: "Residencial",
      description: "Piscinas de uso doméstico en viviendas particulares",
      category: "residencial",
      characteristics: [
        "Uso doméstico",
        "Volumen reducido",
        "Horarios flexibles",
        "Tarifa preferencial"
      ],
      pricing: {
        base: 15.50,
        unit: "m³",
        currency: "MXN"
      },
      requirements: [
        "Comprobante de domicilio",
        "Identificación oficial",
        "Contrato de servicio"
      ],
      pools: 850,
      owners: 720
    },
    {
      id: "2",
      name: "Comercial",
      description: "Piscinas en hoteles, restaurantes y establecimientos comerciales",
      category: "comercial",
      characteristics: [
        "Uso comercial",
        "Volumen medio",
        "Horarios establecidos",
        "Tarifa comercial"
      ],
      pricing: {
        base: 25.75,
        unit: "m³",
        currency: "MXN"
      },
      requirements: [
        "Registro mercantil",
        "Permisos comerciales",
        "Contrato empresarial",
        "Seguro de responsabilidad"
      ],
      pools: 320,
      owners: 180
    },
    {
      id: "3",
      name: "Industrial",
      description: "Piscinas en plantas industriales y centros de producción",
      category: "industrial",
      characteristics: [
        "Uso industrial",
        "Alto volumen",
        "Operación continua",
        "Tarifa industrial"
      ],
      pricing: {
        base: 35.00,
        unit: "m³",
        currency: "MXN"
      },
      requirements: [
        "Registro industrial",
        "Permisos ambientales",
        "Contrato industrial",
        "Plan de manejo de residuos"
      ],
      pools: 45,
      owners: 25
    },
    {
      id: "4",
      name: "Público",
      description: "Piscinas en parques, centros deportivos y espacios públicos",
      category: "publico",
      characteristics: [
        "Uso público",
        "Alto volumen",
        "Acceso comunitario",
        "Tarifa social"
      ],
      pricing: {
        base: 12.00,
        unit: "m³",
        currency: "MXN"
      },
      requirements: [
        "Convenio gubernamental",
        "Presupuesto asignado",
        "Contrato público",
        "Plan de mantenimiento"
      ],
      pools: 180,
      owners: 12
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<ConsumptionType | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const filteredTypes = consumptionTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || type.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const addConsumptionType = (type: Omit<ConsumptionType, "id">) => {
    const newType: ConsumptionType = {
      ...type,
      id: (consumptionTypes.length + 1).toString()
    }
    setConsumptionTypes(prev => [...prev, newType])
    setIsAddingNew(false)
  }

  const updateConsumptionType = (id: string, updates: Partial<ConsumptionType>) => {
    setConsumptionTypes(prev => prev.map(type => 
      type.id === id ? { ...type, ...updates } : type
    ))
    setSelectedType(null)
  }

  const deleteConsumptionType = (id: string) => {
    setConsumptionTypes(prev => prev.filter(type => type.id !== id))
  }

  const stats = {
    total: consumptionTypes.length,
    totalPools: consumptionTypes.reduce((sum, type) => sum + type.pools, 0),
    totalOwners: consumptionTypes.reduce((sum, type) => sum + type.owners, 0),
    avgPrice: consumptionTypes.reduce((sum, type) => sum + type.pricing.base, 0) / consumptionTypes.length
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-0">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Modalidad de Consumo</h1>
              <p className="text-muted-foreground">Gestión de tipos de consumo y tarifas para piscinas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Modalidades</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Piscinas</p>
                    <p className="text-2xl font-bold text-accent">{stats.totalPools}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Propietarios</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalOwners}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Precio Promedio</p>
                    <p className="text-2xl font-bold text-destructive">${stats.avgPrice.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-destructive" />
                </div>
              </Card>
            </div>

            {/* Filters and Actions */}
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar modalidad..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="publico">Público</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddingNew(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Modalidad
                  </Button>
                </div>
              </div>
            </Card>

            {/* Consumption Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTypes.map((type) => (
                <Card key={type.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{type.name}</h3>
                        <Badge 
                          className={
                            type.category === "residencial" ? "bg-accent text-accent-foreground" :
                            type.category === "comercial" ? "bg-primary text-primary-foreground" :
                            type.category === "industrial" ? "bg-destructive text-destructive-foreground" :
                            "bg-secondary text-secondary-foreground"
                          }
                        >
                          {type.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedType(type)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteConsumptionType(type.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{type.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Precio:</span>
                        <span className="font-bold text-lg">
                          ${type.pricing.base} {type.pricing.currency}/{type.pricing.unit}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-2xl font-bold text-primary">{type.pools}</p>
                          <p className="text-xs text-muted-foreground">Piscinas</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-2xl font-bold text-accent">{type.owners}</p>
                          <p className="text-xs text-muted-foreground">Propietarios</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Características:</p>
                        <div className="flex flex-wrap gap-1">
                          {type.characteristics.map((char, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Requisitos:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {type.requirements.map((req, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit/Add Consumption Type Modal */}
      {(selectedType || isAddingNew) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isAddingNew ? "Nueva Modalidad" : `Editar: ${selectedType?.name}`}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <Input
                      value={selectedType?.name || ""}
                      onChange={(e) => setSelectedType({...selectedType!, name: e.target.value})}
                      placeholder="Nombre de la modalidad"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <Select 
                      value={selectedType?.category || ""} 
                      onValueChange={(value) => setSelectedType({...selectedType!, category: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="publico">Público</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <Textarea
                    value={selectedType?.description || ""}
                    onChange={(e) => setSelectedType({...selectedType!, description: e.target.value})}
                    placeholder="Descripción de la modalidad"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Precio Base</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={selectedType?.pricing.base || ""}
                      onChange={(e) => setSelectedType({...selectedType!, pricing: {...selectedType!.pricing, base: parseFloat(e.target.value)}})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unidad</label>
                    <Input
                      value={selectedType?.pricing.unit || ""}
                      onChange={(e) => setSelectedType({...selectedType!, pricing: {...selectedType!.pricing, unit: e.target.value}})}
                      placeholder="m³"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Moneda</label>
                    <Input
                      value={selectedType?.pricing.currency || ""}
                      onChange={(e) => setSelectedType({...selectedType!, pricing: {...selectedType!.pricing, currency: e.target.value}})}
                      placeholder="MXN"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Características (separadas por comas)</label>
                  <Input
                    value={selectedType?.characteristics.join(", ") || ""}
                    onChange={(e) => setSelectedType({...selectedType!, characteristics: e.target.value.split(", ").filter(c => c.trim())})}
                    placeholder="Uso doméstico, Volumen reducido, Horarios flexibles"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Requisitos (uno por línea)</label>
                  <Textarea
                    value={selectedType?.requirements.join("\n") || ""}
                    onChange={(e) => setSelectedType({...selectedType!, requirements: e.target.value.split("\n").filter(r => r.trim())})}
                    placeholder="Comprobante de domicilio&#10;Identificación oficial&#10;Contrato de servicio"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => {
                    if (isAddingNew) {
                      addConsumptionType(selectedType!)
                    } else {
                      updateConsumptionType(selectedType!.id, selectedType!)
                    }
                  }}
                  className="flex-1"
                >
                  {isAddingNew ? "Crear" : "Guardar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedType(null)
                    setIsAddingNew(false)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
