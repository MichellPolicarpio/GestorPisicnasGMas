const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmepdyyincgueaxngloa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

console.log('Updating user metadata...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateUserMetadata() {
  try {
    // Primero hacer login para obtener el token
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'mmoran@grupomasagua.com',
      password: '12345678'
    })
    
    if (loginError) {
      console.error('❌ Login failed:', loginError.message)
      return
    }
    
    console.log('✅ Login successful, updating metadata...')
    
    // Actualizar metadatos del usuario
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: 'Miguel Moran',
        role: 'admin',
        company: 'Grupo Mas Agua'
      }
    })
    
    if (error) {
      console.error('❌ Update failed:', error.message)
    } else {
      console.log('✅ User metadata updated successfully!')
      console.log('Updated user:', data.user?.user_metadata)
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

updateUserMetadata()
