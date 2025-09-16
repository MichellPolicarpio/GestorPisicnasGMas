const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmepdyyincgueaxngloa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

console.log('Testing Supabase Login...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLogin() {
  try {
    console.log('Testing login with: mmoran@grupomasagua.com')
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'mmoran@grupomasagua.com',
      password: '12345678'
    })
    
    if (error) {
      console.error('❌ Login failed:', error.message)
      console.error('Error details:', error)
    } else {
      console.log('✅ Login successful!')
      console.log('User ID:', data.user?.id)
      console.log('Email:', data.user?.email)
      console.log('Created at:', data.user?.created_at)
      console.log('User metadata:', data.user?.user_metadata)
    }
  } catch (err) {
    console.error('❌ Login error:', err.message)
  }
}

testLogin()
