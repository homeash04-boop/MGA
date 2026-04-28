import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, logout, session, profile, profileError, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false)

  if (authLoading) return <div dir="rtl" className="min-h-screen grid place-items-center bg-slate-100">جاري التحميل...</div>
  if (session && profile) return <Navigate to="/dashboard" replace />

  if (session && !profile) {
    return (
      <div dir="rtl" className="min-h-screen grid place-items-center bg-slate-100 px-4">
        <div className="card p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-black text-red-700 mb-3">الحساب غير مكتمل</h1>
          <p className="text-slate-600 leading-7 mb-4">تسجيل الدخول نجح، لكن لا يوجد لهذا الحساب سجل داخل جدول profiles.</p>
          {profileError && <div className="bg-red-50 text-red-700 rounded-xl p-3 text-sm mb-4 text-right">{profileError}</div>}
          <button type="button" onClick={logout} className="btn btn-primary w-full">تسجيل خروج</button>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorText('')
    setLoading(true)
    const { error } = await login(email, password)
    if (error) setErrorText('بيانات الدخول غير صحيحة أو يوجد خطأ في الاتصال')
    setLoading(false)
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-3xl shadow border p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-slate-800">بوابة الطالب المدرسية</h1>
          <p className="text-slate-500 mt-1">تسجيل الدخول</p>
        </div>
        {errorText && <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl text-sm">{errorText}</div>}
        <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
        <input className="input mb-4 text-left" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
        <label className="block mb-2 text-sm font-medium">كلمة المرور</label>
        <input className="input mb-3" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
        <div className="text-left mb-6"><Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">نسيت كلمة المرور؟</Link></div>
        <button disabled={loading} className="btn btn-primary w-full disabled:opacity-60">{loading ? 'جاري الدخول...' : 'دخول'}</button>
      </form>
    </div>
  )
}
