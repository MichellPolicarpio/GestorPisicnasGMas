"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, MapPin, Save, RotateCcw, CheckCircle, AlertCircle, Zap, FileText } from "lucide-react"
import { useState } from "react"
import { usePools } from "@/lib/contexts/pools-context"

export default function AddPoolPage() {
  const { pools, addPool } = usePools()
  const [activeSection, setActiveSection] = useState<"express" | "complete">("express")
  
  // Datos para sección express
  const [expressData, setExpressData] = useState({
    coordinates: ""
  })
  
  // Datos para sección completa
  const [formData, setFormData] = useState({
    description: "",
    lat: "",
    lon: "",
    owner: "",
    consumptionType: "" as "residencial" | "comercial" | "industrial" | "publico" | "",
    notes: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const generatePoolId = () => {
    const existingIds = pools.map(p => p.description)
    // Empezar desde 1395 (última piscina en BD)
    let counter = 1395
    let newId = `pool${counter}`
    
    while (existingIds.includes(newId)) {
      counter++
      newId = `pool${counter}`
    }
    
    return newId
  }

  const validateCoordinates = (lat: string, lon: string) => {
    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)
    
    if (isNaN(latNum) || isNaN(lonNum)) {
      return "Las coordenadas deben ser números válidos"
    }
    
    if (latNum < -90 || latNum > 90) {
      return "La latitud debe estar entre -90 y 90"
    }
    
    if (lonNum < -180 || lonNum > 180) {
      return "La longitud debe estar entre -180 y 180"
    }
    
    return null
  }

  const handleCoordinatePaste = (value: string) => {
    // Detectar formato: "lat, lon" o "lat,lon"
    const parts = value.split(/[,\s]+/).filter(part => part.trim())
    
    if (parts.length === 2) {
      const [lat, lon] = parts
      setFormData(prev => ({
        ...prev,
        lat: lat.trim(),
        lon: lon.trim()
      }))
    }
  }

  const handleExpressCoordinatePaste = (value: string) => {
    setExpressData({ coordinates: value })
  }

  const handleExpressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Parsear coordenadas
      const parts = expressData.coordinates.split(/[,\s]+/).filter(part => part.trim())
      
      if (parts.length !== 2) {
        setMessage({ type: "error", text: "Formato inválido. Usa: latitud, longitud" })
        setIsSubmitting(false)
        return
      }

      const [latStr, lonStr] = parts
      const lat = latStr.trim()
      const lon = lonStr.trim()

      // Validar coordenadas
      const coordError = validateCoordinates(lat, lon)
      if (coordError) {
        setMessage({ type: "error", text: coordError })
        setIsSubmitting(false)
        return
      }

      // Generar ID automático
      const poolId = generatePoolId()

      // Crear nueva piscina
      const newPool = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        description: poolId,
        captured: false
      }

      // Agregar usando el contexto
      addPool(newPool)
      
      setMessage({ 
        type: "success", 
        text: `Piscina ${poolId} agregada exitosamente con coordenadas (${lat}, ${lon})` 
      })
      
      // Limpiar formulario
      setExpressData({ coordinates: "" })

    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Error al agregar la piscina. Inténtalo de nuevo." 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Validar coordenadas
      const coordError = validateCoordinates(formData.lat, formData.lon)
      if (coordError) {
        setMessage({ type: "error", text: coordError })
        setIsSubmitting(false)
        return
      }

      // Generar ID si no se proporciona
      const poolId = formData.description || generatePoolId()

      // Verificar que no exista ya
      if (pools.find(p => p.description === poolId)) {
        setMessage({ type: "error", text: `Ya existe una piscina con el ID: ${poolId}` })
        setIsSubmitting(false)
        return
      }

      // Crear nueva piscina
      const newPool = {
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon),
        description: poolId,
        captured: false,
        owner: formData.owner || undefined,
        consumptionType: formData.consumptionType || undefined,
        notes: formData.notes || undefined
      }

      // Agregar usando el contexto
      addPool(newPool)
      
      setMessage({ 
        type: "success", 
        text: `Piscina ${poolId} agregada exitosamente con coordenadas (${formData.lat}, ${formData.lon})` 
      })
      
      // Limpiar formulario
      setFormData({
        description: "",
        lat: "",
        lon: "",
        owner: "",
        consumptionType: "",
        notes: ""
      })

    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Error al agregar la piscina. Inténtalo de nuevo." 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      description: "",
      lat: "",
      lon: "",
      owner: "",
      consumptionType: "",
      notes: ""
    })
    setExpressData({ coordinates: "" })
    setMessage(null)
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Agregar Nueva Piscina</h1>
              <p className="text-muted-foreground">Registra nuevas piscinas en el sistema con sus coordenadas</p>
            </div>

            {/* Tabs de Navegación */}
            <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveSection("express")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "express"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="h-4 w-4 inline mr-2" />
                Agregado Express
              </button>
              <button
                onClick={() => setActiveSection("complete")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "complete"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Agregado Completo
              </button>
            </div>

            {/* Sección Express */}
            {activeSection === "express" && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">⚡ Agregado Express</h2>
                  <p className="text-muted-foreground">
                    Agrega piscinas rápidamente solo con coordenadas. El ID se genera automáticamente desde pool1395.
                  </p>
                </div>

                <form onSubmit={handleExpressSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="express-coords" className="text-base font-semibold">
                      📍 Coordenadas de la Piscina
                    </Label>
                    <p className="text-sm text-muted-foreground mb-4">
                      Ingresa las coordenadas en formato: latitud, longitud
                    </p>
                    <Input
                      id="express-coords"
                      type="text"
                      placeholder="19.186212398181198, -96.12233939848855"
                      value={expressData.coordinates}
                      onChange={(e) => handleExpressCoordinatePaste(e.target.value)}
                      required
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Ejemplo: 19.186212398181198, -96.12233939848855
                    </p>
                  </div>

                  {/* Mensajes */}
                  {message && (
                    <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      {message.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botones */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Agregando...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Agregar Rápidamente
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Sección Completa */}
            {activeSection === "complete" && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">📋 Agregado Completo</h2>
                  <p className="text-muted-foreground">
                    Agrega piscinas con información detallada incluyendo propietario, modalidad de consumo y notas.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Coordenadas */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">📍 Coordenadas de la Piscina</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ingresa las coordenadas en formato: latitud, longitud (ej: 19.186212398181198, -96.12233939848855)
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lat">Latitud</Label>
                        <Input
                          id="lat"
                          type="text"
                          placeholder="19.186212398181198"
                          value={formData.lat}
                          onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lon">Longitud</Label>
                        <Input
                          id="lon"
                          type="text"
                          placeholder="-96.12233939848855"
                          value={formData.lon}
                          onChange={(e) => setFormData(prev => ({ ...prev, lon: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="coords-paste">Pegar Coordenadas Completas</Label>
                      <Input
                        id="coords-paste"
                        type="text"
                        placeholder="19.186212398181198, -96.12233939848855"
                        onChange={(e) => handleCoordinatePaste(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Pega las coordenadas completas separadas por coma
                      </p>
                    </div>
                  </div>

                  {/* Información de la Piscina */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-semibold">🏊 Información de la Piscina</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">ID de la Piscina</Label>
                      <Input
                        id="description"
                        type="text"
                        placeholder="pool1234 (opcional - se genera automáticamente desde pool1395)"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Si no se especifica, se generará automáticamente desde pool1395
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="owner">Propietario</Label>
                      <Input
                        id="owner"
                        type="text"
                        placeholder="Nombre del propietario (opcional)"
                        value={formData.owner}
                        onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="consumptionType">Modalidad de Consumo</Label>
                      <Select 
                        value={formData.consumptionType} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, consumptionType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar modalidad (opcional)" />
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
                      <Label htmlFor="notes">Notas</Label>
                      <Textarea
                        id="notes"
                        placeholder="Notas adicionales sobre la piscina (opcional)"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Mensajes */}
                  {message && (
                    <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      {message.type === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botones */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Agregando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Agregar Piscina
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Estadísticas */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Total de Piscinas en el Sistema</h3>
                  <p className="text-2xl font-bold text-primary">{pools.length}</p>
                  <p className="text-sm text-muted-foreground">Próximo ID: {generatePoolId()}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
