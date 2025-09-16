require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('*').limit(1)
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message)
      console.log('This might mean the tables are not created yet.')
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
