"use client"

import { useRef, useEffect, useState, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Zap, Activity } from "lucide-react"
import { usePoolData } from "@/lib/hooks/use-pool-data"
import * as THREE from "three"

// Dynamic import for Three.js to avoid SSR issues
const dynamicImport = typeof window !== 'undefined' ? import('three') : Promise.resolve({})

// 3D Pool component
function Pool3D({ poolData }: { poolData: any }) {
  const poolRef = useRef<THREE.Group>(null)
  const waterRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (waterRef.current) {
      // Animate water surface with subtle waves
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
    }
  })

  if (!poolData) return null

  const { currentSensors, equipment } = poolData

  // Determine water color based on pH and chlorine levels
  const getWaterColor = () => {
    if (currentSensors.ph < 7.0 || currentSensors.ph > 7.6) return "#ff6b6b" // Red for bad pH
    if (currentSensors.chlorine < 1.0 || currentSensors.chlorine > 3.0) return "#ffa726" // Orange for bad chlorine
    return "#4fc3f7" // Blue for good water quality
  }

  return (
    <group ref={poolRef}>
      {/* Pool structure */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[8, 1, 4]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Pool walls */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8.2, 2, 4.2]} />
        <meshStandardMaterial color="#b0bec5" transparent opacity={0.3} />
      </mesh>

      {/* Water surface */}
      <mesh ref={waterRef} position={[0, currentSensors.waterLevel - 0.5, 0]}>
        <planeGeometry args={[7.8, 3.8]} />
        <meshStandardMaterial color={getWaterColor()} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Pool equipment indicators */}
      {equipment.pumpStatus && (
        <mesh position={[-3.5, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#4caf50" />
        </mesh>
      )}

      {equipment.heaterStatus && (
        <mesh position={[3.5, 0.5, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshStandardMaterial color="#ff5722" />
        </mesh>
      )}

      {/* Pool lights */}
      {equipment.lightStatus && (
        <>
          <pointLight position={[-2, 1, -1]} intensity={0.5} color="#ffffff" />
          <pointLight position={[2, 1, 1]} intensity={0.5} color="#ffffff" />
          <mesh position={[-2, -0.3, -1]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" />
          </mesh>
          <mesh position={[2, -0.3, 1]}>
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" />
          </mesh>
        </>
      )}

      {/* Sensor data overlays */}
      <Html position={[-3, 1.5, 0]} center>
        <div className="bg-card/90 backdrop-blur-sm p-2 rounded-lg border text-xs">
          <div className="flex items-center gap-1">
            <Thermometer className="h-3 w-3 text-primary" />
            <span>{currentSensors.temperature.toFixed(1)}°C</span>
          </div>
        </div>
      </Html>

      <Html position={[0, 1.5, 0]} center>
        <div className="bg-card/90 backdrop-blur-sm p-2 rounded-lg border text-xs">
          <div className="flex items-center gap-1">
            <Droplets className="h-3 w-3 text-primary" />
            <span>pH {currentSensors.ph.toFixed(1)}</span>
          </div>
        </div>
      </Html>

      <Html position={[3, 1.5, 0]} center>
        <div className="bg-card/90 backdrop-blur-sm p-2 rounded-lg border text-xs">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-primary" />
            <span>{currentSensors.chlorine.toFixed(1)} ppm</span>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Camera controller for better 3D navigation
function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(5, 3, 5)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

// Loading fallback
function Pool3DFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Cargando visualización 3D...</p>
      </div>
    </div>
  )
}

// Main Pool 3D Viewer component
export function Pool3DViewer({ poolId = "pool-001" }: { poolId?: string }) {
  const { data, loading, error } = usePoolData({
    poolId,
    enableRealtime: true,
  })

  const [isFullscreen, setIsFullscreen] = useState(false)

  if (loading) {
    return <Pool3DFallback />
  }

  if (error || !data) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Error al cargar la visualización 3D</div>
      </Card>
    )
  }

  const { currentSensors, equipment } = data

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return "destructive"
    if (value < min + 0.2 || value > max - 0.2) return "secondary"
    return "primary"
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"}`}>
      <Card className="h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Visualización 3D de Piscina</h3>
              <p className="text-sm text-muted-foreground">Pool ID: {poolId.toUpperCase()} | Estado: Activa</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={equipment.pumpStatus ? "default" : "secondary"}>
                Bomba {equipment.pumpStatus ? "ON" : "OFF"}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? "Salir" : "Pantalla Completa"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-96 md:h-[500px]">
          {/* 3D Visualization */}
          <div className="flex-1 relative">
            <Suspense fallback={<Pool3DFallback />}>
              <Canvas shadows camera={{ position: [5, 3, 5], fov: 60 }}>
                <CameraController />
                <ambientLight intensity={0.4} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <Pool3D poolData={data} />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={3}
                  maxDistance={15}
                />
              </Canvas>
            </Suspense>
          </div>

          {/* Sensor Data Panel */}
          <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
            <h4 className="font-semibold text-sm">Datos en Tiempo Real</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Temperatura</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currentSensors.temperature.toFixed(1)}°C</div>
                  <Badge variant={getStatusColor(currentSensors.temperature, 24, 28)} className="text-xs">
                    {currentSensors.temperature >= 24 && currentSensors.temperature <= 28 ? "Óptima" : "Alerta"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">pH</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currentSensors.ph.toFixed(1)}</div>
                  <Badge variant={getStatusColor(currentSensors.ph, 7.0, 7.6)} className="text-xs">
                    {currentSensors.ph >= 7.0 && currentSensors.ph <= 7.6 ? "Óptimo" : "Ajustar"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Cloro</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currentSensors.chlorine.toFixed(1)} ppm</div>
                  <Badge variant={getStatusColor(currentSensors.chlorine, 1.0, 3.0)} className="text-xs">
                    {currentSensors.chlorine >= 1.0 && currentSensors.chlorine <= 3.0 ? "Óptimo" : "Ajustar"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Turbidez</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currentSensors.turbidity.toFixed(1)} NTU</div>
                  <Badge variant={currentSensors.turbidity <= 1.0 ? "default" : "secondary"} className="text-xs">
                    {currentSensors.turbidity <= 1.0 ? "Clara" : "Turbia"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h5 className="font-semibold text-sm mb-3">Estado del Equipo</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bomba Principal</span>
                  <Badge variant={equipment.pumpStatus ? "default" : "secondary"}>
                    {equipment.pumpStatus ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Calentador</span>
                  <Badge variant={equipment.heaterStatus ? "default" : "secondary"}>
                    {equipment.heaterStatus ? "Encendido" : "Apagado"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Iluminación</span>
                  <Badge variant={equipment.lightStatus ? "default" : "secondary"}>
                    {equipment.lightStatus ? "Encendida" : "Apagada"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
