const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmepdyyincgueaxngloa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

console.log('🔐 Testing Full Authentication Flow...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFullAuth() {
  try {
    console.log('\n1. Testing login with: mmoran@grupomasagua.com')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'mmoran@grupomasagua.com',
      password: '12345678'
    })
    
    if (error) {
      console.error('❌ Login failed:', error.message)
      console.error('Error details:', error)
      return
    }
    
    console.log('✅ Login successful!')
    console.log('User ID:', data.user?.id)
    console.log('Email:', data.user?.email)
    console.log('Created at:', data.user?.created_at)
    console.log('User metadata:', data.user?.user_metadata)
    
    console.log('\n2. Testing session persistence...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session check failed:', sessionError.message)
    } else {
      console.log('✅ Session valid:', !!sessionData.session)
      if (sessionData.session) {
        console.log('Session user:', sessionData.session.user.email)
      }
    }
    
    console.log('\n3. Testing logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.error('❌ Logout failed:', logoutError.message)
    } else {
      console.log('✅ Logout successful!')
    }
    
    console.log('\n4. Testing session after logout...')
    const { data: finalSessionData, error: finalSessionError } = await supabase.auth.getSession()
    
    if (finalSessionError) {
      console.error('❌ Final session check failed:', finalSessionError.message)
    } else {
      console.log('✅ Session cleared:', !finalSessionData.session)
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
}

testFullAuth()
