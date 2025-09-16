// Simular el entorno de Next.js
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://rmepdyyincgueaxngloa.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

const { createClient } = require('@supabase/supabase-js')

// Simular el tipo de usuario
const User = {
  id: '',
  email: '',
  name: '',
  role: '',
  avatar_url: null,
  created_at: '',
  updated_at: ''
}

// Simular AuthService
class AuthService {
  static async signIn(email, password) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data.user) {
        return { user: null, error: 'No se pudo obtener la información del usuario' }
      }

      // Crear objeto de usuario básico desde auth.users
      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuario',
        role: data.user.user_metadata?.role || 'viewer',
        avatar_url: data.user.user_metadata?.avatar_url || null,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at || data.user.created_at
      }

      return { user: userData, error: null }
    } catch (error) {
      return { user: null, error: 'Error inesperado al iniciar sesión' }
    }
  }
}

console.log('🔐 Testing AuthService...')
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

async function testAuthService() {
  try {
    console.log('\nTesting AuthService.signIn with: mmoran@grupomasagua.com')
    
    const result = await AuthService.signIn('mmoran@grupomasagua.com', '12345678')
    
    if (result.error) {
      console.error('❌ AuthService.signIn failed:', result.error)
    } else {
      console.log('✅ AuthService.signIn successful!')
      console.log('User:', result.user)
    }
  } catch (err) {
    console.error('❌ AuthService error:', err.message)
  }
}

testAuthService()
