/**
 * Servicio de Reverse Geocoding usando Google Maps API
 * Obtiene información de dirección a partir de coordenadas GPS
 */

export interface AddressInfo {
  formattedAddress: string
  streetNumber?: string
  route?: string // Nombre de la calle
  neighborhood?: string // Colonia/Barrio
  locality?: string // Ciudad
  administrativeArea?: string // Estado
  country?: string
  postalCode?: string
  plusCode?: string
}

export interface GeocodingResult {
  success: boolean
  data?: AddressInfo
  error?: string
}

class GeocodingService {
  private apiKey: string
  private baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Obtiene información de dirección usando coordenadas
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
    try {
      // Validar coordenadas
      if (!this.isValidCoordinate(lat, lng)) {
        return {
          success: false,
          error: 'Coordenadas inválidas'
        }
      }

      // Construir URL de la API
      const url = new URL(this.baseUrl)
      url.searchParams.set('latlng', `${lat},${lng}`)
      url.searchParams.set('key', this.apiKey)
      url.searchParams.set('language', 'es') // Respuestas en español
      url.searchParams.set('region', 'mx') // Priorizar resultados de México

      console.log('🌍 Consultando Google Geocoding API:', { lat, lng })

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0] // Tomar el primer resultado (más preciso)
        const addressInfo = this.parseAddressComponents(result)
        
        console.log('✅ Dirección obtenida:', addressInfo)
        
        return {
          success: true,
          data: addressInfo
        }
      } else if (data.status === 'ZERO_RESULTS') {
        return {
          success: false,
          error: 'No se encontró información de dirección para estas coordenadas'
        }
      } else {
        return {
          success: false,
          error: `Error de Google API: ${data.status} - ${data.error_message || 'Error desconocido'}`
        }
      }

    } catch (error) {
      console.error('❌ Error en reverse geocoding:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en la consulta'
      }
    }
  }

  /**
   * Parsea los componentes de dirección de la respuesta de Google
   */
  private parseAddressComponents(result: any): AddressInfo {
    const addressInfo: AddressInfo = {
      formattedAddress: result.formatted_address || ''
    }

    // Parsear componentes específicos
    if (result.address_components) {
      for (const component of result.address_components) {
        const types = component.types

        if (types.includes('street_number')) {
          addressInfo.streetNumber = component.long_name
        } else if (types.includes('route')) {
          addressInfo.route = component.long_name
        } else if (types.includes('sublocality') || types.includes('neighborhood')) {
          addressInfo.neighborhood = component.long_name
        } else if (types.includes('locality')) {
          addressInfo.locality = component.long_name
        } else if (types.includes('administrative_area_level_1')) {
          addressInfo.administrativeArea = component.long_name
        } else if (types.includes('country')) {
          addressInfo.country = component.long_name
        } else if (types.includes('postal_code')) {
          addressInfo.postalCode = component.long_name
        }
      }
    }

    // Obtener Plus Code si está disponible
    if (result.plus_code && result.plus_code.global_code) {
      addressInfo.plusCode = result.plus_code.global_code
    }

    return addressInfo
  }

  /**
   * Valida que las coordenadas sean válidas
   */
  private isValidCoordinate(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' && 
      typeof lng === 'number' &&
      !isNaN(lat) && 
      !isNaN(lng) &&
      isFinite(lat) && 
      isFinite(lng) &&
      lat >= -90 && 
      lat <= 90 && 
      lng >= -180 && 
      lng <= 180
    )
  }

  /**
   * Obtiene múltiples direcciones en lote (con rate limiting)
   */
  async batchReverseGeocode(
    coordinates: { lat: number, lng: number, id: string }[],
    onProgress?: (current: number, total: number, id: string) => void
  ): Promise<Map<string, GeocodingResult>> {
    const results = new Map<string, GeocodingResult>()
    
    for (let i = 0; i < coordinates.length; i++) {
      const coord = coordinates[i]
      
      // Reportar progreso
      if (onProgress) {
        onProgress(i + 1, coordinates.length, coord.id)
      }

      // Obtener dirección
      const result = await this.reverseGeocode(coord.lat, coord.lng)
      results.set(coord.id, result)

      // Rate limiting: esperar 100ms entre requests para evitar límites de Google
      if (i < coordinates.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return results
  }
}

// Instancia singleton del servicio
let geocodingService: GeocodingService | null = null

export function getGeocodingService(apiKey?: string): GeocodingService {
  if (!geocodingService) {
    const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyCZNbaJPL33NYGfwgTBO1DXzMh9nfhQc28'
    geocodingService = new GeocodingService(key)
  }
  return geocodingService
}

export { GeocodingService }
