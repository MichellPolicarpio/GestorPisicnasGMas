const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rmepdyyincgueaxngloa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZXBkeXlpbmNndWVheG5nbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDAwOTYsImV4cCI6MjA3MzI3NjA5Nn0.Ric4dySinNQGBUCX1jhGm-UUoGAasUpcgTvWR2DfpSE'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('*').limit(1)
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message)
      console.log('This means the tables are not created yet.')
      console.log('Please run the SQL scripts from SUPABASE_SETUP.md in your Supabase dashboard.')
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('Users found:', data.length)
    }
  } catch (err) {
    console.error('Connection failed:', err.message)
  }
}

testConnection()
