import { createClient } from '@supabase/supabase-js'

// 创建一个函数来获取 Supabase 客户端
export function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'Accept': 'application/json'
      }
    }
  })
}

// 导出一个默认实例（在客户端使用）
export const supabase = (() => {
  try {
    return getSupabase()
  } catch {
    return null
  }
})()