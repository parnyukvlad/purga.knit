import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bebachat.fun/'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYmFjaGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE5ODgwMDAsImV4cCI6MjAzNzM0ODAwMH0.sEqr3uF7XMu1sIDAKNCzd_Ydarucz7TsKr7Tene5nog'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables - using defaults')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Отключаем автоматическое подтверждение email
    detectSessionInUrl: true,
    // Пытаемся отключить требование подтверждения
    flowType: 'pkce',
  },
  // Глобальные настройки для отключения email подтверждения
  global: {
    headers: {
      'x-client-info': 'purgaknit-webshop',
    },
  },
})

