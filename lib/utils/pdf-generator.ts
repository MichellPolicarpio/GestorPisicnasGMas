import jsPDF from 'jspdf'
import type { AddressInfo } from '@/lib/services/geocoding'

export interface PoolData {
  id: string
  lat: number
  lon: number
  description: string
  captured: boolean
  owner?: string
  consumptionType?: "residencial" | "comercial" | "industrial" | "publico"
  notes?: string
  lastUpdated?: string
  // Nueva información de dirección
  addressInfo?: AddressInfo
  addressLastFetched?: string
}

export const generatePoolPDF = (pool: PoolData) => {
  const doc = new jsPDF()
  
  // Configuración de colores
  const primaryColor = '#2563eb'
  const secondaryColor = '#64748b'
  const accentColor = '#0ea5e9'
  
  // Configuración de fuentes
  doc.setFont('helvetica')
  
  // Header con logo y título
  doc.setFillColor(primaryColor)
  doc.rect(0, 0, 210, 30, 'F')
  
  // Título principal
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Sistema de Identificación de Piscinas', 20, 20)
  
  // Subtítulo
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Grupo MAs Agua - Reporte de Piscina', 20, 25)
  
  // Fecha de generación (simplificada para que quepa)
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  doc.text(`Fecha: ${currentDate}`, 140, 20)
  
  // Línea separadora
  doc.setDrawColor(primaryColor)
  doc.setLineWidth(0.5)
  doc.line(20, 35, 190, 35)
  
  // Información de la piscina
  let yPosition = 50
  
  // ID de la piscina (destacado)
  doc.setFillColor(accentColor)
  doc.rect(20, yPosition - 5, 170, 12, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`PISCINA: ${pool.description}`, 25, yPosition + 2)
  
  yPosition += 20
  
  // Estado de revisión
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Estado de Revisión:', 20, yPosition)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  const statusText = pool.captured ? 'REVISADA' : 'NO REVISADA'
  const statusColor = pool.captured ? [34, 197, 94] : [239, 68, 68]
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.setFont('helvetica', 'bold')
  doc.text(statusText, 80, yPosition)
  
  yPosition += 15
  
  // Coordenadas
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Coordenadas Geográficas:', 20, yPosition)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Latitud: ${pool.lat}°`, 20, yPosition + 8)
  doc.text(`Longitud: ${pool.lon}°`, 20, yPosition + 16)
  
  // Mapa de coordenadas (simulado)
  doc.setDrawColor(secondaryColor)
  doc.setLineWidth(1)
  doc.rect(120, yPosition - 5, 70, 30)
  doc.setFontSize(10)
  doc.text('Ubicación en Veracruz', 125, yPosition + 5)
  doc.text(`Lat: ${pool.lat}`, 125, yPosition + 12)
  doc.text(`Lon: ${pool.lon}`, 125, yPosition + 20)
  
  yPosition += 35

  // Información de dirección (NUEVA SECCIÓN)
  if (pool.addressInfo) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Informacion de Direccion:', 20, yPosition)
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    
    // Dirección completa
    if (pool.addressInfo.formattedAddress) {
      const addressLines = doc.splitTextToSize(pool.addressInfo.formattedAddress, 170)
      doc.setFont('helvetica', 'bold')
      doc.text('Dirección Completa:', 20, yPosition)
      doc.setFont('helvetica', 'normal')
      yPosition += 6
      for (const line of addressLines) {
        doc.text(line, 25, yPosition)
        yPosition += 6
      }
      yPosition += 2
    }

    // Detalles de dirección en columnas
    const leftColumn = 25
    const rightColumn = 110
    let leftY = yPosition
    let rightY = yPosition

    if (pool.addressInfo.route || pool.addressInfo.streetNumber) {
      doc.setFont('helvetica', 'bold')
      doc.text('Calle:', leftColumn, leftY)
      doc.setFont('helvetica', 'normal')
      const street = `${pool.addressInfo.streetNumber || ''} ${pool.addressInfo.route || ''}`.trim()
      doc.text(street, leftColumn + 20, leftY)
      leftY += 8
    }

    if (pool.addressInfo.neighborhood) {
      doc.setFont('helvetica', 'bold')
      doc.text('Colonia:', leftColumn, leftY)
      doc.setFont('helvetica', 'normal')
      doc.text(pool.addressInfo.neighborhood, leftColumn + 20, leftY)
      leftY += 8
    }

    if (pool.addressInfo.locality) {
      doc.setFont('helvetica', 'bold')
      doc.text('Ciudad:', rightColumn, rightY)
      doc.setFont('helvetica', 'normal')
      doc.text(pool.addressInfo.locality, rightColumn + 20, rightY)
      rightY += 8
    }

    if (pool.addressInfo.administrativeArea) {
      doc.setFont('helvetica', 'bold')
      doc.text('Estado:', rightColumn, rightY)
      doc.setFont('helvetica', 'normal')
      doc.text(pool.addressInfo.administrativeArea, rightColumn + 20, rightY)
      rightY += 8
    }

    if (pool.addressInfo.postalCode) {
      doc.setFont('helvetica', 'bold')
      doc.text('Código Postal:', leftColumn, leftY)
      doc.setFont('helvetica', 'normal')
      doc.text(pool.addressInfo.postalCode, leftColumn + 30, leftY)
      leftY += 8
    }

    if (pool.addressInfo.plusCode) {
      doc.setFont('helvetica', 'bold')
      doc.text('Plus Code:', rightColumn, rightY)
      doc.setFont('helvetica', 'normal')
      doc.text(pool.addressInfo.plusCode, rightColumn + 25, rightY)
      rightY += 8
    }

    yPosition = Math.max(leftY, rightY) + 5

    // Fecha de obtención de dirección
    if (pool.addressLastFetched) {
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Dirección obtenida: ${new Date(pool.addressLastFetched).toLocaleDateString('es-ES')}`, 20, yPosition)
      yPosition += 8
    }

    yPosition += 5
  }

  // Información adicional
  if (pool.owner || pool.consumptionType || pool.notes) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Información Adicional:', 20, yPosition)
    yPosition += 10
    
    if (pool.owner) {
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Propietario: ${pool.owner}`, 20, yPosition)
      yPosition += 8
    }
    
    if (pool.consumptionType) {
      const consumptionLabels = {
        'residencial': 'Residencial',
        'comercial': 'Comercial',
        'industrial': 'Industrial',
        'publico': 'Público'
      }
      doc.text(`Modalidad de Consumo: ${consumptionLabels[pool.consumptionType]}`, 20, yPosition)
      yPosition += 8
    }
    
    if (pool.notes) {
      doc.text(`Notas: ${pool.notes}`, 20, yPosition)
      yPosition += 8
    }
  }
  
  yPosition += 10
  
  // Fecha de última actualización
  if (pool.lastUpdated) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(secondaryColor)
    doc.text(`Última actualización: ${pool.lastUpdated}`, 20, yPosition)
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFillColor(240, 240, 240)
  doc.rect(0, pageHeight - 20, 210, 20, 'F')
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Sistema de Identificación de Piscinas - Grupo MAs Agua', 20, pageHeight - 10)
  doc.text(`Página 1 de 1`, 180, pageHeight - 10)
  
  // QR Code removido por petición del usuario
  
  return doc
}

export const downloadPoolPDF = (pool: PoolData) => {
  const doc = generatePoolPDF(pool)
  const fileName = `piscina_${pool.description}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

