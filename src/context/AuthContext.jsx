import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadProfile(userId) {
    setProfileError(null)
    if (!userId) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Profile load error:', error)
      setProfile(null)
      setProfileError(error.message || 'تعذر تحميل ملف المستخدم')
      return null
    }

    if (!data) {
      setProfile(null)
      setProfileError('الحساب موجود في Authentication لكنه غير موجود في جدول profiles')
      return null
    }

    setProfile(data)
    return data
  }

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (!mounted) return

      if (error) {
        setProfileError(error.message)
        setLoading(false)
        return
      }

      const currentSession = data?.session || null
      setSession(currentSession)

      if (currentSession?.user?.id) await loadProfile(currentSession.user.id)
      else setProfile(null)

      if (mounted) setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return
      setLoading(true)
      setSession(currentSession)

      if (currentSession?.user?.id) await loadProfile(currentSession.user.id)
      else {
        setProfile(null)
        setProfileError(null)
      }

      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe()
    }
  }, [])

  async function login(email, password) {
    setProfileError(null)
    return await supabase.auth.signInWithPassword({ email, password })
  }

  async function logout() {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
    setProfileError(null)
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user || null,
      profile,
      profileError,
      loading,
      login,
      logout,
      reloadProfile: loadProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
