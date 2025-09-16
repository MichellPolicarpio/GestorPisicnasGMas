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
import { Building2, Search, Plus, Edit, Trash2, MapPin, Phone, Mail, Users } from "lucide-react"
import { useState } from "react"

interface Owner {
  id: string
  name: string
  type: "persona" | "empresa" | "gobierno"
  contact: {
    phone?: string
    email?: string
    address?: string
  }
  pools: string[]
  consumptionType: "residencial" | "comercial" | "industrial" | "publico"
  notes?: string
  createdAt: string
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([
    {
      id: "1",
      name: "Hotel Marriott Veracruz",
      type: "empresa",
      contact: {
        phone: "+52 229 123 4567",
        email: "contacto@marriott-veracruz.com",
        address: "Av. Costa Verde 123, Veracruz"
      },
      pools: ["pool1", "pool3", "pool7"],
      consumptionType: "comercial",
      notes: "Cliente premium con múltiples piscinas",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Residencial Los Pinos",
      type: "empresa",
      contact: {
        phone: "+52 229 987 6543",
        email: "admin@lospinos.com",
        address: "Fracc. Los Pinos, Veracruz"
      },
      pools: ["pool2", "pool4", "pool5", "pool6"],
      consumptionType: "residencial",
      notes: "Complejo residencial con piscina comunitaria",
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      name: "Juan Pérez",
      type: "persona",
      contact: {
        phone: "+52 229 555 1234",
        email: "juan.perez@email.com",
        address: "Calle Reforma 456, Veracruz"
      },
      pools: ["pool8"],
      consumptionType: "residencial",
      notes: "Propietario individual",
      createdAt: "2024-02-01"
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const filteredOwners = owners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.contact.phone?.includes(searchTerm)
    const matchesType = typeFilter === "all" || owner.type === typeFilter
    return matchesSearch && matchesType
  })

  const addOwner = (owner: Omit<Owner, "id" | "createdAt">) => {
    const newOwner: Owner = {
      ...owner,
      id: (owners.length + 1).toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setOwners(prev => [...prev, newOwner])
    setIsAddingNew(false)
  }

  const updateOwner = (id: string, updates: Partial<Owner>) => {
    setOwners(prev => prev.map(owner => 
      owner.id === id ? { ...owner, ...updates } : owner
    ))
    setSelectedOwner(null)
  }

  const deleteOwner = (id: string) => {
    setOwners(prev => prev.filter(owner => owner.id !== id))
  }

  const stats = {
    total: owners.length,
    personas: owners.filter(o => o.type === "persona").length,
    empresas: owners.filter(o => o.type === "empresa").length,
    gobierno: owners.filter(o => o.type === "gobierno").length,
    totalPools: owners.reduce((sum, owner) => sum + owner.pools.length, 0)
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Propietarios</h1>
              <p className="text-muted-foreground">Gestión de propietarios y sus piscinas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Propietarios</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Personas</p>
                    <p className="text-2xl font-bold text-accent">{stats.personas}</p>
                  </div>
                  <Users className="h-8 w-8 text-accent" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Empresas</p>
                    <p className="text-2xl font-bold text-primary">{stats.empresas}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gobierno</p>
                    <p className="text-2xl font-bold text-destructive">{stats.gobierno}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-destructive" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Piscinas</p>
                    <p className="text-2xl font-bold text-accent">{stats.totalPools}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-accent" />
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
                      placeholder="Buscar por nombre, email o teléfono..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="persona">Personas</SelectItem>
                      <SelectItem value="empresa">Empresas</SelectItem>
                      <SelectItem value="gobierno">Gobierno</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsAddingNew(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Propietario
                  </Button>
                </div>
              </div>
            </Card>

            {/* Owners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOwners.map((owner) => (
                <Card key={owner.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{owner.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {owner.type === "persona" ? "Persona" : 
                           owner.type === "empresa" ? "Empresa" : "Gobierno"}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedOwner(owner)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteOwner(owner.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {owner.contact.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{owner.contact.phone}</span>
                        </div>
                      )}
                      {owner.contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{owner.contact.email}</span>
                        </div>
                      )}
                      {owner.contact.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{owner.contact.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Piscinas:</span>
                        <Badge>{owner.pools.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Modalidad:</span>
                        <Badge variant="outline">{owner.consumptionType}</Badge>
                      </div>
                    </div>

                    {owner.notes && (
                      <p className="text-sm text-muted-foreground italic">{owner.notes}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Edit/Add Owner Modal */}
      {(selectedOwner || isAddingNew) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isAddingNew ? "Nuevo Propietario" : `Editar: ${selectedOwner?.name}`}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nombre</label>
                  <Input
                    value={selectedOwner?.name || ""}
                    onChange={(e) => setSelectedOwner({...selectedOwner!, name: e.target.value})}
                    placeholder="Nombre del propietario"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select 
                    value={selectedOwner?.type || ""} 
                    onValueChange={(value) => setSelectedOwner({...selectedOwner!, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="persona">Persona</SelectItem>
                      <SelectItem value="empresa">Empresa</SelectItem>
                      <SelectItem value="gobierno">Gobierno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Teléfono</label>
                  <Input
                    value={selectedOwner?.contact.phone || ""}
                    onChange={(e) => setSelectedOwner({...selectedOwner!, contact: {...selectedOwner!.contact, phone: e.target.value}})}
                    placeholder="Número de teléfono"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={selectedOwner?.contact.email || ""}
                    onChange={(e) => setSelectedOwner({...selectedOwner!, contact: {...selectedOwner!.contact, email: e.target.value}})}
                    placeholder="Correo electrónico"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Dirección</label>
                  <Input
                    value={selectedOwner?.contact.address || ""}
                    onChange={(e) => setSelectedOwner({...selectedOwner!, contact: {...selectedOwner!.contact, address: e.target.value}})}
                    placeholder="Dirección"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Modalidad de Consumo</label>
                  <Select 
                    value={selectedOwner?.consumptionType || ""} 
                    onValueChange={(value) => setSelectedOwner({...selectedOwner!, consumptionType: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residencial">Residencial</SelectItem>
                      <SelectItem value="comercial">Comercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="publico">Público</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Notas</label>
                  <Textarea
                    value={selectedOwner?.notes || ""}
                    onChange={(e) => setSelectedOwner({...selectedOwner!, notes: e.target.value})}
                    placeholder="Notas adicionales..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button 
                  onClick={() => {
                    if (isAddingNew) {
                      addOwner(selectedOwner!)
                    } else {
                      updateOwner(selectedOwner!.id, selectedOwner!)
                    }
                  }}
                  className="flex-1"
                >
                  {isAddingNew ? "Crear" : "Guardar"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedOwner(null)
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
