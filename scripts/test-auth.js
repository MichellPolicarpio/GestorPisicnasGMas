const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmepdyyincgueaxngloa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

console.log('Testing Supabase Authentication...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuth() {
  try {
    // Test authentication connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error connecting to Supabase Auth:', error.message)
    } else {
      console.log('✅ Supabase Authentication connection successful!')
      console.log('Current session:', data.session ? 'Active' : 'No session')
    }
  } catch (err) {
    console.error('Auth connection failed:', err.message)
  }
}

testAuth()
