import { createServiceClient } from '@/lib/supabase/server'

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServiceClient()
  
  const { data, error } = await supabase
    .from('purgaknit_users')
    .select('is_admin')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return data.is_admin === true
}

