import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bebachat.fun/'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYmFjaGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5ODgwMDAsImV4cCI6MjAzNzM0ODAwMH0.sEqr3uF7XMu1sIDAKNCzd_Ydarucz7TsKr7Tene5nog'

export async function createServerClient() {
  const cookieStore = await cookies()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      getSession: async () => {
        const accessToken = cookieStore.get('sb-access-token')?.value
        const refreshToken = cookieStore.get('sb-refresh-token')?.value
        
        if (!accessToken || !refreshToken) {
          return { data: { session: null }, error: null }
        }
        
        return {
          data: {
            session: {
              access_token: accessToken,
              refresh_token: refreshToken,
            } as any,
          },
          error: null,
        }
      },
    },
  })
}

export async function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYmFjaGF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTk4ODAwMCwiZXhwIjoyMDM3MzQ4MDAwfQ.obJvxC0YYquRd-w1xweAbmegQcKhoNd7bASWOB95bK0'
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

