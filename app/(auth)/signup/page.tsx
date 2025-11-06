'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Проверяем базовое подключение к Supabase (проверка URL и ключа)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase environment variables not set, using defaults')
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
          data: {
            full_name: fullName,
          },
        },
      })

      console.log('Signup response:', { 
        hasUser: !!data.user, 
        userId: data.user?.id,
        error: signUpError?.message,
        errorCode: signUpError?.status 
      })

      // КРИТИЧНО: Проверяем, что пользователь действительно создан
      if (!data.user) {
        // Пользователь не создан - это критическая ошибка
        const errorMessage = signUpError?.message || 'Failed to create user account'
        console.error('User not created:', signUpError)
        
        // Если пользователь уже существует
        if (errorMessage.includes('already') || errorMessage.includes('exists') || errorMessage.includes('User already registered')) {
          setError('An account with this email already exists. Please login instead.')
        } else {
          setError(`Registration failed: ${errorMessage}. Please check your connection and try again.`)
        }
        setLoading(false)
        return
      }

      // Пользователь создан успешно - проверяем ошибки
      if (signUpError) {
        const errorMessage = signUpError.message || String(signUpError)
        console.warn('Signup warning (user created but error occurred):', errorMessage)
        
        // Игнорируем только ошибки отправки email, если пользователь создан
        if (errorMessage.includes('email') || errorMessage.includes('Email') || errorMessage.includes('confirmation')) {
          console.log('Email error ignored - user was created successfully')
          // Продолжаем создание профиля
        } else {
          // Другие ошибки - показываем, но продолжаем
          console.error('Non-email error during signup:', signUpError)
        }
      }

      // Убеждаемся, что профиль создан в purgaknit_users
      const profileCreated = await ensureUserProfile(data.user.id, email, fullName)
      
      if (profileCreated) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/account')
          router.refresh()
        }, 2000)
      } else {
        // Профиль не создан, но пользователь создан - показываем предупреждение
        setError('Account created but profile setup failed. Please contact support.')
        console.error('Profile creation failed for user:', data.user.id)
      }
    } catch (err: any) {
      console.error('Signup error (catch block):', err)
      const errorMessage = err?.message || String(err) || 'An error occurred during signup'
      
      // Не показываем успех, если пользователь не создан
      if (errorMessage.includes('already') || errorMessage.includes('exists')) {
        setError('An account with this email already exists. Please login instead.')
      } else {
        setError(`Registration failed: ${errorMessage}. Please try again or contact support.`)
      }
    } finally {
      setLoading(false)
    }
  }

  // Функция для создания профиля пользователя, если триггер не сработал
  const ensureUserProfile = async (userId: string, userEmail: string, userName: string): Promise<boolean> => {
    try {
      console.log('Ensuring user profile for:', userId)
      
      // Проверяем, существует ли уже профиль
      const { data: existingUser, error: selectError } = await supabase
        .from('purgaknit_users')
        .select('id')
        .eq('id', userId)
        .single()

      if (selectError && selectError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', selectError)
      }

      // Если профиля нет, создаем его
      if (!existingUser) {
        console.log('Profile not found, creating new profile...')
        const { data: insertedData, error: insertError } = await supabase
          .from('purgaknit_users')
          .insert({
            id: userId,
            email: userEmail,
            full_name: userName || null,
          })
          .select()

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          console.error('Insert error details:', {
            message: insertError.message,
            code: insertError.code,
            details: insertError.details,
            hint: insertError.hint
          })
          return false
        }

        if (insertedData && insertedData.length > 0) {
          console.log('Profile created successfully:', insertedData[0])
          return true
        }
      } else {
        console.log('Profile already exists:', existingUser.id)
        return true
      }

      return false
    } catch (err) {
      console.error('Error ensuring user profile:', err)
      return false
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0a] py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a] border border-[#8B0000]/20 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-[#8B0000] mb-6 font-serif italic">Sign Up</h1>
            
            {success && (
              <div className="mb-4 p-3 bg-[#8B0000]/20 border border-[#8B0000] rounded-md">
                <p className="text-sm text-[#8B0000] font-serif">Account created successfully! Redirecting...</p>
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-[#8B0000]/20 border border-[#8B0000] rounded-md">
                <p className="text-sm text-[#8B0000] font-serif">{error}</p>
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#F5F5DC] mb-1 font-serif">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#8B0000]/30 text-[#F5F5DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] placeholder:text-[#F5F5DC]/40"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#F5F5DC] mb-1 font-serif">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#8B0000]/30 text-[#F5F5DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] placeholder:text-[#F5F5DC]/40"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#F5F5DC] mb-1 font-serif">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#8B0000]/30 text-[#F5F5DC] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B0000] placeholder:text-[#F5F5DC]/40"
                />
                <p className="mt-1 text-xs text-[#F5F5DC]/50 font-serif">Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#8B0000] text-[#F5F5DC] py-2 px-4 rounded-md hover:bg-[#5C0000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-serif"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#F5F5DC]/70 font-serif">
                Already have an account?{' '}
                <Link href="/login" className="text-[#8B0000] font-medium hover:text-[#5C0000] transition-colors">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

